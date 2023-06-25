import { Tabs } from "@shopify/polaris";
import { useCallback } from "react";

export const tabs = [
  {
    id: "all",
    content: "All",
    accessibilityLabel: "All customers",
    panelID: "ALL",
  },
  {
    id: "active",
    content: "Active",
    panelID: "ACTIVE",
  },
  {
    id: "draft",
    content: "Draft",
    panelID: "DRAFT",
  },
];

export function BundleViewStatus(props) {
  const { selectedTab, setSelectedTab, reset } = props;

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
    reset();
  }, []);

  return (
    <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}></Tabs>
  );
}
