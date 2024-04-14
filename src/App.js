import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./App.css";

const initData = {
  initialNodes: {
    name: "Unattached nodes",
    items: [
      { id: "1", content: "node 1" },
      { id: "2", content: "node 2" },
      { id: "3", content: "node 3" },
      { id: "4", content: "node 4" },
      { id: "5", content: "node 5" },
    ],
  },
};

const initForwardData = {
  forward_chain_1: {
    name: "Forward Chain",
    items: [
      { id: "7", content: "node 7" },
      { id: "8", content: "node 8" },
    ],
  },
  forward_chain_2: {
    name: "Forward Chain",
    items: [
      { id: "6", content: "node 6" },
      { id: "36", content: "node 36" },
    ],
  },
};

const initBackwardData = {
  backward_chain_1: {
    name: "Backward Chain",
    items: [
      { id: "117", content: "node 117" },
      { id: "118", content: "node 118" },
    ],
  },
  backward_chain_2: {
    name: "Backward Chain",
    items: [
      { id: "116", content: "node 116" },
      { id: "136", content: "node 136" },
    ],
  },
};

const onDragEnd = (
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

  // Если нода перемещается из Unattached nodes в forward block
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

  // Если нода перемещается из forward block в Unattached nodes
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

  // Если нода перемещается из Unattached nodes в backward block
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

  // Если нода перемещается из backward block в Unattached nodes
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

  // Если элементы перемещаются между блоками forward
  if (
    source.droppableId.includes("forward") &&
    destination.droppableId.includes("forward")
  ) {
    if (source.droppableId !== destination.droppableId) {
      console.log(result);
      // Если элемент перемещается в другой блок
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
      // Если элемент остаётся внутри родительского блока
      const column = forwardColumns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setForwardColums({
        ...forwardColumns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  }
};

function App() {
  const [columns, setColumns] = useState(initData);
  const [forwardColumns, setForwardColums] = useState(initForwardData);
  const [backwardColumns, setBackwardColums] = useState(initBackwardData);

  return (
    <div className="layout">
      <div className="wrapper">
        <DragDropContext
          onDragEnd={(result) =>
            onDragEnd(
              result,
              columns,
              setColumns,
              forwardColumns,
              setForwardColums,
              backwardColumns,
              setBackwardColums
            )
          }
        >
          <div className="unattached-block">
            {Object.entries(columns).map(([columnId, column]) => {
              return (
                <div key={columnId}>
                  <div className="title_container">
                    <div className="title-name">{column.name}</div>
                  </div>
                  <div className="chain_wrapper">
                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            className="chain"
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#cfe1eed1"
                                : "rgb(235, 236, 240)",
                            }}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided) => {
                                    return (
                                      <div
                                        className="node"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        {item.content}
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="forward-block">
            {Object.entries(forwardColumns).map(([columnId, column]) => {
              return (
                <div key={columnId}>
                  <div className="title_container">
                    <div className="title-name">{column.name}</div>
                  </div>
                  <div className="chain_wrapper">
                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            className="chain"
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#cfe1eed1"
                                : "rgb(235, 236, 240)",
                            }}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided) => {
                                    return (
                                      <div
                                        className="node"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        {item.content}
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="backward-block">
            {Object.entries(backwardColumns).map(([columnId, column]) => {
              return (
                <div key={columnId}>
                  <div className="title_container">
                    <div className="title-name">{column.name}</div>
                  </div>
                  <div className="chain_wrapper">
                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            className="chain"
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#cfe1eed1"
                                : "rgb(235, 236, 240)",
                            }}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided) => {
                                    return (
                                      <div
                                        className="node"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        {item.content}
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
