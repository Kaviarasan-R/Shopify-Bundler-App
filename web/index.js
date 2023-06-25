// @ts-nocheck
import "dotenv/config";
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import webhookHandlers from "./webhook-handlers.js";
import fetchProducts from "./helpers/fetchProducts.js";
import productCreate from "./helpers/productCreate.js";
import fetchBundles from "./helpers/fetchBundles.js";
import deleteBundles from "./helpers/deleteBundles.js";
import fetchBundleById from "./helpers/fetchBundleById.js";
import editBundles from "./helpers/editBundles.js";
import createBundleRule from "./helpers/createBundleRule.js";
import fetchBundleRules from "./helpers/fetchBundleRules.js";
import deleteBundleRules from "./helpers/deleteBundleRules.js";
import fetchProductsByParams from "./helpers/fetchProductsByParams.js";

import fetchBundleRuleById from "./controllers/fetchBundleRuleById.js";
import editBundleRulesById from "./controllers/editBundleRulesById.js";

import fetchOrders from "./controllers/fetchOrders.js";

import sequelize from "./config/database.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database: ", err);
  });

const app = express();

app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({
    webhookHandlers,
  })
);

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

/* API MANAGEMENT */

app.get("/api/products", async (req, res) => {
  try {
    const cursor = req?.query?.cursor;
    const title = req?.query?.title;
    const session = res.locals.shopify.session;
    const products = await fetchProducts(session, title, cursor);
    res.status(200).send({ products });
  } catch (err) {
    throw err;
  }
});

app.post("/api/bundles/create", async (req, res) => {
  try {
    const body = req.body;
    const session = res.locals.shopify.session;
    const response = await productCreate(session, body);
    res.status(200).send(response);
  } catch (err) {
    throw err;
  }
});

app.get("/api/bundles", async (req, res) => {
  try {
    const pageNumber = req.query.page;
    const bundleStatus = req.query.status;
    const sortPage = req.query.sort;
    const bundleType = req.query.bundleType;
    const queryBundle = req.query.queryBundle;
    const response = await fetchBundles(
      pageNumber,
      bundleStatus,
      sortPage,
      bundleType,
      queryBundle
    );
    res.status(200).send({ response });
  } catch (err) {
    throw err;
  }
});

app.delete("/api/bundles/delete", async (req, res) => {
  try {
    const body = req.body;
    const session = res.locals.shopify.session;
    const response = await deleteBundles(body, session);
    res.status(200).send(response);
  } catch (err) {
    throw err;
  }
});

app.get("/api/bundles/:id", async (req, res) => {
  try {
    const bundleId = `gid://shopify/Product/${req.params.id}`;
    const response = await fetchBundleById(bundleId);
    res.status(200).send(response);
  } catch (err) {
    throw err;
  }
});

app.post("/api/bundles/edit", async (req, res) => {
  try {
    const body = req.body;
    const session = res.locals.shopify.session;
    const response = await editBundles(body, session);
    res.status(200).send(response);
  } catch (err) {
    throw err;
  }
});

app.post("/api/bundles/rules/create", async (req, res) => {
  try {
    const body = req.body;
    const response = await createBundleRule(body);
    res.status(200).send(response);
  } catch (err) {
    throw err;
  }
});

app.get("/api/bundles/rules/fetch", async (req, res) => {
  try {
    const pageNumber = req.query.page;
    const sortPage = req.query.sort;
    const queryBundle = req.query.queryBundle;
    const response = await fetchBundleRules(pageNumber, sortPage, queryBundle);
    res.status(200).send(response);
  } catch (err) {
    throw err;
  }
});

app.delete("/api/bundles/rules/delete", async (req, res) => {
  try {
    const body = req.body;
    const response = await deleteBundleRules(body);
    res.status(200).send(response);
  } catch (err) {
    throw err;
  }
});

app.get("/api/bundles/rules/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await fetchBundleRuleById(id);
    res.status(200).send(response);
  } catch (err) {
    throw err;
  }
});

app.post("/api/bundles/rules/edit", async (req, res) => {
  try {
    const body = req.body;
    const response = await editBundleRulesById(body);
    res
      .status(200)
      .send({ message: response.message, status: response.status });
  } catch (err) {
    throw err;
  }
});

app.post("/api/bundles/rules/generate", async (req, res) => {
  try {
    const body = req.body;
    const session = res.locals.shopify.session;
    const response = await fetchProductsByParams(body, session);
    res.status(200).send(response);
  } catch (err) {
    throw err;
  }
});

app.post("/api/orders/fetch", async (req, res) => {
  try {
    const body = req.body;
    const response = await fetchOrders(body);
    res.status(200).send(response);
  } catch (err) {
    throw err;
  }
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
