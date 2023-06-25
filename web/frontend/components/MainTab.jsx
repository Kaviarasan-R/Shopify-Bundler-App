import { useState, useCallback } from "react";
import { LegacyTabs } from "@shopify/polaris";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate } from "@shopify/app-bridge-react";

export function MainTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleTabChange = useCallback((selectedTabIndex) => {
    navigate(tabs[selectedTabIndex].path);
  }, []);

  const tabs = [
    {
      id: "home",
      content: "Home",
      path: "/home",
      panelID: "/home-page",
    },
    {
      id: "analytics",
      content: "Analytics",
      path: "/analytics",
      panelID: "/analytics-page",
    },
    {
      id: "about",
      content: "About",
      path: "/about",
      panelID: "/about-page",
    },
  ];
  return <LegacyTabs tabs={tabs} onSelect={handleTabChange}></LegacyTabs>;
}
