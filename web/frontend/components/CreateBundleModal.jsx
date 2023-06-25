import { Modal, Box, Button, LegacyCard, Icon, Grid } from "@shopify/polaris";
import { useState, useCallback } from "react";
import {
  AppsMajor,
  CollectionsMajor,
  DiscountsMajor,
  ListMajor,
  ExistingInventoryMajor,
} from "@shopify/polaris-icons";

import "../assets/styles.css";

import { useNavigate } from "@shopify/app-bridge-react";

export function CreateBundleModal() {
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback(() => setActive(!active), [active]);

  const activator = (
    <Button onClick={handleChange} primary>
      Create new bundles
    </Button>
  );

  const bundleTypeData = [
    {
      id: "1",
      icon: <Icon source={ListMajor} />,
      name: "Bundle",
      description:
        "Offer a discount when a customer buys some fixed products together. (Combo product option is available)",
      example: "Example: Buy X + Y to get 20% off.",
    },
    {
      id: "2",
      icon: <Icon source={DiscountsMajor} />,
      name: "Volume Discount",
      description:
        "Offer a discount when a customer buys several instances of the same product.",
      example: "Example: BOGO, Buy 3 items of X to get 20% off.",
    },
    {
      id: "3",
      icon: <Icon source={CollectionsMajor} />,
      name: "Collection mix & match",
      description:
        "Offer a discount when a customer buys specified numbers of products from specified collections.",
      example:
        "Example: Buy 4 items from collection X and 2 from collection Y to get $30 off.",
    },
    {
      id: "4",
      icon: <Icon source={AppsMajor} />,
      name: "Product mix & match",
      description:
        "Offer a discount when a customer buys at least a specific number of items from a group of products. (Combo product option is available)",
      example: "Example: Buy at least 2 items from X, Y, Z to get 20% off.",
    },
    {
      id: "5",
      icon: <Icon source={ExistingInventoryMajor} />,
      name: "Buy X get Y",
      description:
        "Offer free gifts or discounted product(s) when a customer buys specific product(s).",
      example:
        "Example: Buy X and get Y for free or Buy X and get Y with 20% off.",
    },
  ];

  const createBundleMarkup = bundleTypeData.map(
    ({ id, icon, name, description, example }, index) => (
      <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }} key={index}>
        <div
          onClick={index === 0 ? () => navigate("/createbundleform") : () => {}}
          className='bundle--type--selector'
        >
          <LegacyCard>
            <LegacyCard.Section>
              {icon}
              <h1 className='bundle--type--modal--title'>{name}</h1>
              <p className='bundle--type--modal--description'>{description}</p>
            </LegacyCard.Section>
            <LegacyCard.Section>
              <p>{example}</p>
            </LegacyCard.Section>
          </LegacyCard>
        </div>
      </Grid.Cell>
    )
  );

  return (
    <Modal
      large
      activator={activator}
      open={active}
      onClose={handleChange}
      title='Create Bundle'
      secondaryActions={[
        {
          content: "Cancel",
          onAction: handleChange,
        },
      ]}
    >
      <Modal.Section>
        <Grid>{createBundleMarkup}</Grid>
      </Modal.Section>
    </Modal>
  );
}
