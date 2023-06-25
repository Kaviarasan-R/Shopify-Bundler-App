import {
  TextField,
  Tag,
  HorizontalStack,
  Button,
  Text,
} from "@shopify/polaris";
import { useState, useCallback } from "react";

export function BundleRuleTags(props) {
  const {
    bundleRuleProductTags,
    setBundleRuleProductTags,
    selectedProductTags,
    setSelectedProductTags,
  } = props;

  const handleTagInputChange = useCallback((value) => {
    setBundleRuleProductTags(value);
  }, []);

  const handleAddTag = useCallback(() => {
    if (
      bundleRuleProductTags &&
      !selectedProductTags.includes(bundleRuleProductTags)
    ) {
      setSelectedProductTags((previousTags) => [
        ...previousTags,
        bundleRuleProductTags,
      ]);
      setBundleRuleProductTags("");
    }
  }, [bundleRuleProductTags]);

  const removeTag = useCallback(
    (tag) => () => {
      setSelectedProductTags((previousTags) =>
        previousTags.filter((previousTag) => previousTag !== tag)
      );
    },
    []
  );

  const tagMarkup = selectedProductTags.map((tag) => (
    <Tag key={tag} onRemove={removeTag(tag)}>
      {tag}
    </Tag>
  ));

  return (
    <>
      <Text>Product Tags</Text>
      <div style={{ marginBottom: "5px" }}></div>
      <HorizontalStack blockAlign='center' gap='4'>
        <TextField
          label='Product Tags'
          labelHidden
          value={bundleRuleProductTags}
          onChange={handleTagInputChange}
          autoComplete='off'
        />
        <Button onClick={handleAddTag}>Add Tag</Button>
      </HorizontalStack>
      <div style={{ marginBottom: "8px" }}></div>
      <HorizontalStack spacing='tight' gap='3'>
        {tagMarkup}
      </HorizontalStack>
    </>
  );
}
