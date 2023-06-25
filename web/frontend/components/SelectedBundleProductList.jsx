import React, { useState, useCallback, useEffect } from "react";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { SelectedBundleProductListItem } from "./SelectedBundleProductListItem";

export function SelectedBundleProductList(props) {
  const { items, setItems, setSelectedBundleProducts } = props;
  const [cancelIdx, setCancelIdx] = useState(new Set());

  const handleProductRemoveItemFromRender = useCallback((index) => {
    setCancelIdx((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.delete(index);
      return updatedSet;
    });
  }, []);

  const handleDragEnd = useCallback(({ source, destination }) => {
    if (!destination) return; // Item dropped outside of Droppable
    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    setItems((oldItems) => {
      const newItems = Array.from(oldItems); // Duplicate the array
      const [draggedItem] = newItems.splice(sourceIndex, 1);
      newItems.splice(destinationIndex, 0, draggedItem);
      return newItems;
    });

    setCancelIdx((prev) => {
      const updatedSet = new Set(prev);
      const cancelledIndex = [...prev].find(
        (index) => index >= sourceIndex && index < destinationIndex
      );
      if (cancelledIndex !== undefined) {
        updatedSet.delete(cancelledIndex);
      }
      return updatedSet;
    });
  }, []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId='root'>
        {(provided) => {
          return (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {items.map((item, index) =>
                !cancelIdx.has(index) ? (
                  <SelectedBundleProductListItem
                    key={item.id}
                    id={item.id}
                    index={index}
                    title={item.title}
                    url={item.url}
                    setSelectedBundleProducts={setSelectedBundleProducts}
                    handleProductRemoveItemFromRender={
                      handleProductRemoveItemFromRender
                    }
                  />
                ) : (
                  ""
                )
              )}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
}
