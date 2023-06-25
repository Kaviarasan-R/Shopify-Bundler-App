import React, { useState, useCallback } from "react";

import {
  ResourceItem,
  Icon,
  Thumbnail,
  Text,
  Tooltip,
  Box,
  Button,
  HorizontalStack,
} from "@shopify/polaris";
import { DragHandleMinor, CancelMajor } from "@shopify/polaris-icons";
import { Draggable } from "react-beautiful-dnd";
import "../assets/styles.css";

export function SelectedBundleProductListItem(props) {
  const {
    id,
    index,
    title,
    url,
    setSelectedBundleProducts,
    handleProductRemoveItemFromRender,
  } = props;
  const handleRemoveClick = useCallback(() => {
    handleProductRemoveItemFromRender(index);
    setSelectedBundleProducts(id);
  }, [setSelectedBundleProducts, handleProductRemoveItemFromRender]);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={
              snapshot.isDragging
                ? { background: "white", ...provided.draggableProps.style }
                : provided.draggableProps.style
            }
          >
            <ResourceItem id={id}>
              <div className='selected--bundle--item'>
                <div className='selected--bundle--item__1'>
                  <div {...provided.dragHandleProps}>
                    <Tooltip content='Drag to reorder list items'>
                      <Icon source={DragHandleMinor} color='inkLightest' />
                    </Tooltip>
                  </div>
                  <Thumbnail source={`${url}/60/60`} alt={""} />
                  <Text variant={"headingSm"} as='h6' breakWord truncate>
                    {title.length > 30 ? `${title.slice(0, 30)}...` : title}
                  </Text>
                </div>
                <Button onClick={handleRemoveClick}>
                  <Icon source={CancelMajor} color='inkLightest' />
                </Button>
              </div>
            </ResourceItem>
          </div>
        );
      }}
    </Draggable>
  );
}
