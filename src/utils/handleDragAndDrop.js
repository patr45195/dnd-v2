export const handleDragAndDrop = (
  result,
  columns,
  setColumns,
  forwardColumns,
  setForwardColums,
  backwardColumns,
  setBackwardColums
) => {
  if (!result.destination) return;
  const { source, destination } = result;

  // Within unattached-block
  if (
    source.droppableId.includes("initialNodes") &&
    destination.droppableId.includes("initialNodes")
  ) {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }

  // From unattached-block to forward-block
  if (
    source.droppableId.includes("initialNodes") &&
    destination.droppableId.includes("forward")
  ) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = forwardColumns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    const forwardColumnId = Object.keys(forwardColumns).find((key) =>
      destination.droppableId.includes(key)
    );

    setColumns({
      ...columns,
      initialNodes: {
        ...columns.initialNodes,
        items: sourceItems,
      },
    });

    setForwardColums({
      ...forwardColumns,
      [forwardColumnId]: {
        ...forwardColumns[forwardColumnId],
        items: [
          ...forwardColumns[forwardColumnId].items.slice(0, destination.index),
          removed,
          ...forwardColumns[forwardColumnId].items.slice(destination.index),
        ],
      },
    });
  }
  // From forward-block to unattached-block
  if (
    source.droppableId.includes("forward") &&
    destination.droppableId.includes("initialNodes")
  ) {
    const sourceColumn = forwardColumns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setForwardColums({
      ...forwardColumns,
      [source.droppableId]: { ...sourceColumn, items: sourceItems },
    });
    setColumns({
      ...columns,
      initialNodes: { ...destColumn, items: destItems },
    });
  }
  // From unattached-block to backward-block
  if (
    source.droppableId.includes("initialNodes") &&
    destination.droppableId.includes("backward")
  ) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = backwardColumns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    const backwardColumnId = Object.keys(backwardColumns).find((key) =>
      destination.droppableId.includes(key)
    );
    setColumns({
      ...columns,
      initialNodes: {
        ...columns.initialNodes,
        items: sourceItems,
      },
    });
    setBackwardColums({
      ...backwardColumns,
      [backwardColumnId]: {
        ...backwardColumns[backwardColumnId],
        items: [
          ...backwardColumns[backwardColumnId].items.slice(
            0,
            destination.index
          ),
          removed,
          ...backwardColumns[backwardColumnId].items.slice(destination.index),
        ],
      },
    });
  }
  // From backward-block to unattached-block
  if (
    source.droppableId.includes("backward") &&
    destination.droppableId.includes("initialNodes")
  ) {
    const sourceColumn = backwardColumns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setBackwardColums({
      ...backwardColumns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
    });
    setColumns({
      ...columns,
      initialNodes: {
        ...destColumn,
        items: destItems,
      },
    });
  }
  // From backward-block to forward-block
  if (
    source.droppableId.includes("backward") &&
    destination.droppableId.includes("forward")
  ) {
    const sourceColumn = backwardColumns[source.droppableId];
    const destColumn = forwardColumns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    const forwardColumnId = Object.keys(forwardColumns).find((key) =>
      destination.droppableId.includes(key)
    );
    setBackwardColums({
      ...backwardColumns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
    });
    setForwardColums({
      ...forwardColumns,
      [forwardColumnId]: {
        ...forwardColumns[forwardColumnId],
        items: [
          ...forwardColumns[forwardColumnId].items.slice(0, destination.index),
          removed,
          ...forwardColumns[forwardColumnId].items.slice(destination.index),
        ],
      },
    });
  }
  // From forward-block to backward-block
  if (
    source.droppableId.includes("forward") &&
    destination.droppableId.includes("backward")
  ) {
    const sourceColumn = forwardColumns[source.droppableId];
    const destColumn = backwardColumns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    const forwardColumnId = Object.keys(backwardColumns).find((key) =>
      destination.droppableId.includes(key)
    );
    setForwardColums({
      ...forwardColumns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
    });
    setBackwardColums({
      ...backwardColumns,
      [forwardColumnId]: {
        ...backwardColumns[forwardColumnId],
        items: [
          ...backwardColumns[forwardColumnId].items.slice(0, destination.index),
          removed,
          ...backwardColumns[forwardColumnId].items.slice(destination.index),
        ],
      },
    });
  }
  // Within forward-block
  if (
    source.droppableId.includes("forward") &&
    destination.droppableId.includes("forward")
  ) {
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = forwardColumns[source.droppableId];
      const destColumn = forwardColumns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setForwardColums({
        ...forwardColumns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = forwardColumns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setForwardColums({
        ...forwardColumns,
        [source.droppableId]: { ...column, items: copiedItems },
      });
    }
  }
  // Within backward-block
  if (
    source.droppableId.includes("backward") &&
    destination.droppableId.includes("backward")
  ) {
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = backwardColumns[source.droppableId];
      const destColumn = backwardColumns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setBackwardColums({
        ...backwardColumns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      });
    } else {
      const column = backwardColumns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setBackwardColums({
        ...backwardColumns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  }
};
