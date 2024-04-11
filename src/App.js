import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./App.css";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

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
    items: [
      { id: "7", content: "node 7" },
      { id: "8", content: "node 8" },
    ],
  },
  chain_2: {
    name: "Chain 2",
    items: [{ id: "6", content: "node 6" }],
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
        const unattachedNodes = updatedColumns["initialNodes"];
        updatedColumns[itemName].items.forEach((item) => {
          unattachedNodes.items.push(item);
        });

        delete updatedColumns[itemName];
      } else {
        console.log("Does not exit");
      }
      return updatedColumns;
    });
  };

  return (
    <div className="layout">
      <div className="wrapper">
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            const isUnattachedNodes = columnId === "initialNodes";

            return (
              <div className="container" key={columnId}>
                <div className="title-container">
                  <h2>{column.name}</h2>
                  {!isUnattachedNodes && (
                    <IconButton onClick={() => removeChain(columnId)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </div>
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
        <Button onClick={addChain}>Add Chain</Button>
      </div>
    </div>
  );
}

export default App;