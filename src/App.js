import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./App.css";

const nodes = [
  { id: "1", content: "node 1" },
  { id: "2", content: "node 2" },
  { id: "3", content: "node 3" },
  { id: "4", content: "node 4" },
  { id: "5", content: "node 5" },
];

const initData = {
  initialNodes: {
    name: "Unattached nodes",
    items: nodes,
  },
  chain_1: {
    name: "Chain 1",
    items: [],
  },
  chain_2: {
    name: "Chain 2",
    items: [{ id: "6", content: "node 6" }],
  },
  chain_3: {
    name: "Chain 3",
    items: [
      { id: "7", content: "node 7" },
      { id: "8", content: "node 8" },
    ],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    // Если элемент перемещается в другой блок
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
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
};

function App() {
  const [columns, setColumns] = useState(initData);
  const [split, setSplit] = useState(false);

  const addChain = () => {
    setColumns((prevState) => {
      return {
        ...prevState,
        [`chain_${Object.keys(prevState).length}`]: {
          name: `Chain_${Object.keys(prevState).length}`,
          items: [],
        },
      };
    });
  };

  const removeChain = (itemName) => {
    if (itemName === "initialNodes") return;

    setColumns((prevState) => {
      const updatedColumns = { ...prevState };

      if (updatedColumns[itemName]) {
        delete updatedColumns[itemName];
      } else {
        console.log("Does not exit");
      }
      return updatedColumns;
    });
  };

  const handleSplit = () => {
    setSplit(!split);
  };

  return (
    <div className="layout">
      <div className="wrapper">
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          <button onClick={handleSplit}>Split</button>
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div className="container" key={columnId}>
                <h2>{column.name}</h2>
                <button onClick={() => removeChain(columnId)}>
                  Remove Chain
                </button>
                <div className="chainWrapper">
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided) => {
                      return (
                        <div
                          className="chain"
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
        </DragDropContext>
        <button onClick={addChain}>Add Chain</button>
      </div>
    </div>
  );
}

export default App;
