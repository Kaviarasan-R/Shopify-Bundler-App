# Shopify Bundler App 

Supercharge your Shopify store with Shopify Bundler, a powerful app designed to simplify the creation, management, and analytics of product bundles. Built with React.js, Node.js, GraphQL, MySQL, Sequelize (ORM), Polaris (UI framework), and integrated webhooks for instant order updates, Shopify Bundler is the ultimate solution for maximizing sales and enhancing the shopping experience.

## Key Features

**Powerful Bundle Creation and Management:**

- Easily create and manage bundles with a user-friendly interface.
- Define bundle details like name, product selection, discount type, value, and bundle status.
- Enjoy seamless filtering, searching, and sorting capabilities for efficient bundle management.
- Stay organized with minimalistic pagination, ensuring a clean and uncluttered experience.

**Automatic Bundle Generation:**

- Generate bundles automatically based on predefined rules.
- Set rules including bundle name, product tags, discount type, value, total products, and price range.
- Let the app do the work for you, creating attractive bundles effortlessly.

**Comprehensive Analytics:**

- Gain valuable insights into bundle performance and customer behavior.
- Analyze order data within specific date ranges for focused insights.
- Discover key information such as bundle count, total bundles sold, orders with bundles, order dates, product details, customer information, item summaries, bundle value (discounted price + pre-tax price), order value (discounted price + post-tax price), and total sales value (pre-discount price + pre-tax price).

**Bundle Display and Pricing:**
- Capture your customers' attention with visually appealing bundled product displays.
- The app prominently showcases bundled products and the total discounted price on product pages, in the cart, and during checkout.
- Clearly distinguish bundle components and display both the original price and the discounted price.

**Responsive User Interface:**
- Deliver a seamless experience across all devices with our responsive user interface. Built with React.js and the app ensures optimal performance and usability on both desktop and mobile devices.

**Data Communication and Management:**
- Efficiently communicate with the Shopify API using GraphQL and seamlessly manage data.
- Fetch product information, create, update, and delete bundles, and apply discounts effortlessly.
- Our integration with MySQL and Sequelize (ORM) ensures robust data storage and retrieval, adhering to best practices for querying.

**Webhook Integration:**
- Stay up to date with instant order updates using webhooks.
- Receive real-time notifications about new orders, enabling you to provide timely and efficient customer service.
- Seamlessly integrate with your existing systems to process orders and ensure accurate inventory management.
- Capture valuable order data for analytics and save it in your database for further analysis and reporting.
- Streamline your operations and enhance customer satisfaction with seamless webhook integration.

With our feature-rich Bundle Manager, you can efficiently create, manage, and analyze bundles, ensuring an enhanced shopping experience for your customers and maximizing your sales potential.

## Database Schema

**Bundle, Products & Bundle Products Mapping (Many To Many Relationship)**

![Product-Bundler drawio](https://github.com/Kaviarasan-R/Shopify-Bundler-App/assets/62686489/b19601e8-0332-45e2-bc1b-d3b70beb1bd9)

**Bundle Rules**

![Product-Bundler drawio](https://github.com/Kaviarasan-R/Shopify-Bundler-App/assets/62686489/6d828610-b5ad-4e03-8abd-2db1b102a05b)

**Orders**

![Product-Bundler drawio](https://github.com/Kaviarasan-R/Shopify-Bundler-App/assets/62686489/9e589c18-3849-4c3a-9ff1-bc7a9f85ee7c)

## App Requirements

**Requirements**

- Shopify partners account
- Create development store
- Node.js
- Ngrok
- MySQL

**Configure Environment Variables**

```DATABASE_NAME=bundler```

```DATABASE_USERNAME=root```

```DATABASE_PASSWORD=root```

```DATABASE_HOST=localhost```

```DATABASE_DIALECT=mysql```

**Setup Ngrok For Webhooks**

- Install Ngrok && run ```ngrok http 3000```
- Change package.json scripts:
  ```dev: shopify app dev --tunnel-url=https://4dcc-42-106-74-85.ngrok-free.app:3000```
- Create webhook in developement store:
  
  ```Settings > Notification > Create Webhooks && paste --tunnel-url```
  
  ```Choose webhook API version as (Latest) && Select event to subscribe```

## Screenshots

**Bundle View**

<img width="1280" alt="home" src="https://github.com/Kaviarasan-R/Shopify-Bundler-App/assets/62686489/3be51647-7a9c-4a02-9592-c2a75aaa46ff">

**Bundle Filters**

<img width="1280" alt="Screenshot 2023-06-26 at 5 32 18 AM" src="https://github.com/Kaviarasan-R/Shopify-Bundler-App/assets/62686489/fccc66fe-3287-441c-b152-32a7d912a488">

**Bundle Creation Type**

<img width="1280" alt="Screenshot 2023-06-26 at 5 32 01 AM" src="https://github.com/Kaviarasan-R/Shopify-Bundler-App/assets/62686489/f35f0eb6-b3ec-4fda-800e-06541e71ae8a">

**Bundle Creation - Select Products**

<img width="1280" alt="Screenshot 2023-06-26 at 5 33 00 AM" src="https://github.com/Kaviarasan-R/Shopify-Bundler-App/assets/62686489/93af6b85-2f36-4a59-843e-e579f0b9de25">

**Bundle Creation - Discounts, Preview, Status**

<img width="1280" alt="Screenshot 2023-06-26 at 5 33 46 AM" src="https://github.com/Kaviarasan-R/Shopify-Bundler-App/assets/62686489/f9ba6b6f-f711-467b-a244-c54c0ac87fd3">

**Bundle Creation - General**

<img width="1280" alt="Screenshot 2023-06-26 at 5 34 09 AM" src="https://github.com/Kaviarasan-R/Shopify-Bundler-App/assets/62686489/62822e74-237c-4198-894c-65f9975964ce">

**Bundle Rules View**

<img width="1280" alt="Screenshot 2023-06-26 at 5 31 42 AM" src="https://github.com/Kaviarasan-R/Shopify-Bundler-App/assets/62686489/780d524e-7969-4adb-98ee-ed379e798dd7">

**Bundle Rules - Name, Product Tags, Discount Type, Discount Value, Total Products, Price Range**

<img width="1280" alt="Screenshot 2023-06-26 at 5 35 20 AM" src="https://github.com/Kaviarasan-R/Shopify-Bundler-App/assets/62686489/a0737331-e27b-4173-8637-d7f546a9889b">

**Analytics**

<img width="1280" alt="Screenshot 2023-06-26 at 5 35 48 AM" src="https://github.com/Kaviarasan-R/Shopify-Bundler-App/assets/62686489/d73e3f52-665c-4aa2-ac38-ed2b3192ae4a">

**About**

<img width="1280" alt="Screenshot 2023-06-26 at 5 35 55 AM" src="https://github.com/Kaviarasan-R/Shopify-Bundler-App/assets/62686489/505b819d-5b80-4992-83c7-ec9d6449925d">

<hr />

# Thank you
