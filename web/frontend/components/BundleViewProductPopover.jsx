import { Popover, ResourceList, Icon } from "@shopify/polaris";
import { DropdownMinor } from "@shopify/polaris-icons";
import { useCallback } from "react";

export function BundleViewProductPopover(props) {
  const {
    popoverActive,
    setPopoverActive,
    bundles,
    bundleIndex,
    setBundleIndex,
    startIndex,
    index,
  } = props;

  const handleResourceListItemClick = useCallback(() => {}, []);

  const togglePopoverActive = useCallback((index) => {
    setPopoverActive((prevState) => {
      const newState = [...prevState].map((d, i) => {
        return i !== index ? false : prevState[index];
      });
      newState[index] = !newState[index];
      return newState;
    });
    setBundleIndex(index);
  }, []);

  const productsBundleList = bundles[bundleIndex]?.products?.map((data) => ({
    title: data.title,
    image: data.image,
  }));

  function renderItem({ title, image }) {
    return (
      <ResourceList.Item
        id={title}
        media={<img src={image} alt={title} width={50} height={50} />}
        onClick={handleResourceListItemClick}
      >
        {title}
      </ResourceList.Item>
    );
  }

  return (
    <Popover
      sectioned
      active={popoverActive[startIndex + index]}
      activator={
        <button
          onClick={() => togglePopoverActive(startIndex + index)}
          className='toggle--popover--btn'
        >
          <Icon source={DropdownMinor} />
        </button>
      }
      onClose={() => togglePopoverActive(startIndex + index)}
      ariaHaspopup={false}
    >
      <Popover.Pane>
        <ResourceList items={productsBundleList} renderItem={renderItem} />
      </Popover.Pane>
    </Popover>
  );
}
