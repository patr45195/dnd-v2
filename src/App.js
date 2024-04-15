import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./App.css";
import { handleDragAndDrop } from "./utils/handleDragAndDrop";

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
    name: "Chain Item",
    items: [
      { id: "7", content: "node 7" },
      { id: "8", content: "node 8" },
    ],
  },
  forward_chain_2: {
    name: "Chain Item",
    items: [
      { id: "6", content: "node 6" },
      { id: "36", content: "node 36" },
    ],
  },
};

const initBackwardData = {
  backward_chain_1: {
    name: "Chain Item",
    items: [
      { id: "117", content: "node 117" },
      { id: "118", content: "node 118" },
    ],
  },
  backward_chain_2: {
    name: "Chain Item",
    items: [
      { id: "116", content: "node 116" },
      { id: "136", content: "node 136" },
    ],
  },
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
            handleDragAndDrop(
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
          <div className="direction-blocks">
            <div className="forward-block">
              <h2 className="direction-title">Forward →</h2>
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
              <h2 className="direction-title">Backward ←</h2>
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
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
