import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
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
  forward_chain_1: {
    name: "Forward Chain",
    items: [
      { id: "7", content: "node 7" },
      { id: "8", content: "node 8" },
    ],
  },
  forward_chain_2: {
    name: "Forward Chain",
    items: [{ id: "6", content: "node 6" }],
  },
  backward_chain_3: {
    name: "Backward Chain",
    items: [{ id: "16", content: "node 16" }],
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

  const handleSubmit = () => {
    const forwardItems = [];
    const backwardItems = [];

    const initialChainNames = Object.keys(columns);

    initialChainNames.forEach((chainName) => {
      if (columns.hasOwnProperty(chainName)) {
        if (chainName.includes("forward")) {
          columns[chainName].items.forEach((item) => {
            forwardItems.push(Number(item.id));
          });
        } else if (chainName.includes("backward")) {
          columns[chainName].items.forEach((item) => {
            backwardItems.push(Number(item.id));
          });
        }
      }
    });

    const result = {
      forward: forwardItems,
      backward: backwardItems,
    };

    console.log(result);
  };

  const canAddForwardChain = () => {
    const columnKeys = Object.keys(columns);
    if (columnKeys.length === 1 && columnKeys[0] === "initialNodes") {
      return false;
    }
    return !columnKeys.slice(-1)[0].includes("forward");
  };

  const canAddBackwardChain = () => {
    const columnKeys = Object.keys(columns);
    return (
      !columnKeys.slice(-1)[0].includes("backward") &&
      columnKeys.slice(1).includes("forward")
    );
  };

  const addForwardChain = () => {
    setColumns((prevState) => {
      return {
        ...prevState,
        [`forward_chain_${Object.keys(prevState).length}`]: {
          name: `Forward Chain`,
          items: [],
        },
      };
    });
  };

  const addBackwardChain = () => {
    setColumns((prevState) => {
      return {
        ...prevState,
        [`backward_chain_${Object.keys(prevState).length}`]: {
          name: `Backward Chain`,
          items: [],
        },
      };
    });
  };

  const removeChain = (itemName) => {
    setColumns((prevState) => {
      const updatedColumns = { ...prevState };

      if (updatedColumns[itemName]) {
        const unattachedNodes = updatedColumns["initialNodes"];
        updatedColumns[itemName].items.forEach((item) => {
          unattachedNodes.items.unshift(item);
        });

        delete updatedColumns[itemName];
      } else {
        console.log("Does not exit");
      }
      return updatedColumns;
    });
  };

  const getContainerStyle = (columnId) => {
    if (columnId === "initialNodes") return "unattached_container";
    if (columnId.includes("forward")) return "forward_container";
    if (columnId.includes("backward")) return "backward_container";
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
              <div className={getContainerStyle(columnId)} key={columnId}>
                <div className="title_container">
                  <div className="title-name">{column.name}</div>
                  {!isUnattachedNodes && (
                    <IconButton onClick={() => removeChain(columnId)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </div>
                <div className="chain_wrapper">
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
      </div>
      <div className="buttons-wrapper">
        <Button
          sx={{ background: "#c15e5e" }}
          variant="contained"
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button
          disabled={canAddForwardChain()}
          variant="contained"
          onClick={addForwardChain}
        >
          Add Forward Chain
        </Button>
        <Button
          disabled={canAddBackwardChain()}
          sx={{ background: "black" }}
          variant="contained"
          onClick={addBackwardChain}
        >
          Add Backward Chain
        </Button>
      </div>
    </div>
  );
}

export default App;
