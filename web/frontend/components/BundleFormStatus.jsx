import { Button, Popover, OptionList } from "@shopify/polaris";
import { useCallback } from "react";

export function BundleFormStatus(props) {
  const {
    popoverBundleStatusActive,
    setPopoverBundleStatusActive,
    selectedBundleStatus,
    setSelectedBundleStatus,
  } = props;
  const togglePopoverBundleStatusActive = useCallback(
    () => setPopoverBundleStatusActive((popoverActive) => !popoverActive),
    []
  );
  const activator = (
    <Button
      onClick={togglePopoverBundleStatusActive}
      fullWidth
      textAlign='left'
    >
      {selectedBundleStatus}
    </Button>
  );

  return (
    <Popover
      active={popoverBundleStatusActive}
      activator={activator}
      autofocusTarget='first-node'
      onClose={togglePopoverBundleStatusActive}
      fluidContent
      fullWidth
    >
      <OptionList
        onChange={setSelectedBundleStatus}
        options={[
          {
            value: "Active",
            label: "Active",
          },
          {
            value: "Draft",
            label: "Draft",
          },
        ]}
        selected={selectedBundleStatus}
      />
    </Popover>
  );
}

export default BundleFormStatus;
