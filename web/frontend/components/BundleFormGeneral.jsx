import { Box, TextField } from "@shopify/polaris";
import { useCallback } from "react";

export function BundleFormGeneral(props) {
  const {
    bundleName,
    setBundleName,
    bundleTitle,
    setBundleTitle,
    bundleDescription,
    setBundleDescription,
  } = props;

  const handleBundleNameChange = useCallback(
    (value) => setBundleName(value),
    []
  );

  const handleBundleTitleChange = useCallback(
    (value) => setBundleTitle(value),
    []
  );

  const handleBundleDescriptionChange = useCallback(
    (value) => setBundleDescription(value),
    []
  );

  return (
    <>
      <Box paddingBlockStart='1'>
        <TextField
          label='Name'
          value={bundleName}
          onChange={handleBundleNameChange}
          autoComplete='off'
          helpText='Your customers won’t see this name. This name is used for you to identify this bundle.'
        />
      </Box>
      <Box paddingBlockStart='6'>
        <TextField
          label='Title'
          value={bundleTitle}
          onChange={handleBundleTitleChange}
          autoComplete='off'
          helpText='Your customers will see this at the top of the bundle displays. You can choose the best phrase or sentence to entice your customers to buy the bundle.'
        />
      </Box>
      <Box paddingBlockStart='6'>
        <TextField
          label='Description'
          value={bundleDescription}
          onChange={handleBundleDescriptionChange}
          autoComplete='off'
          helpText='Your customers will see this at the bottom of the bundle displays. You can choose the best phrase or sentence to describe the bundle.'
        />
      </Box>
    </>
  );
}

export default BundleFormGeneral;
