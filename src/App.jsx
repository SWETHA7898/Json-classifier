import React, { useState, useEffect } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import Json from "./components/json";
import Search from "./components/search";

export default function App() {
  const [inputData, setInputData] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const handleJsonParsed = (json) => {
    setInputData(json);
  };

 
  
  useEffect(() => {
    if (!inputData) return;

    const generatedNodes = [];
    const generatedEdges = [];
    let nodeId = 0;
    const levelWidth = 350;
    const levelHeight = 120;

    const getNodeType = (value) => {
      if (value === null) return "primitive";
      if (Array.isArray(value)) return "array";
      if (typeof value === "object") return "object";
      return "primitive";
    };

    const getNodeStyle = (type) => ({
      object: {
        backgroundColor: "#8b5cf6",
        color: "white",
        padding: "12px 16px",
        borderRadius: 8,
        border: "2px solid #6d28d9",
        minWidth: 150,
      },
      array: {
        backgroundColor: "#10b981",
        color: "white",
        padding: "12px 16px",
        borderRadius: 8,
        border: "2px solid #059669",
        minWidth: 150,
      },
      primitive: {
        backgroundColor: "#f59e0b",
        color: "white",
        padding: "12px 16px",
        borderRadius: 8,
        border: "2px solid #d97706",
        minWidth: 150,
      },
    }[type]);

    function processNode(
      data,
      key,
      parentId,
      level,
      indexInLevel,
      siblingsCount,
      path = "",
      isRoot = false
    ) {
      const currentPath = path ? `${path}.${key || "root"}` : key || "root";
      const id = `node-${nodeId++}`;
      const type = getNodeType(data);
      const x = (indexInLevel - (siblingsCount - 1) / 2) * levelWidth + 500;
      const y = level * levelHeight + 50;

      let label = "";
      if (type === "object" || type === "array") {
        label = key || (isRoot ? "Root" : "");
      } else {
        const valueStr =
          data === null
            ? "null"
            : typeof data === "string"
            ? `"${data}"`
            : String(data);
        label = `${key}: ${valueStr}`;
      }

      const nodeStyle = getNodeStyle(type);

      generatedNodes.push({
  id,
  position: { x, y },
  data: { label, path: currentPath },
  type: "default",
  style: nodeStyle,
  originalStyle: nodeStyle, 
});


      if (parentId !== null) {
        generatedEdges.push({
          id: `${parentId}-${id}`,
          source: parentId,
          target: id,
          type: "smoothstep",
          animated: false,
          style: { stroke: "#94a3b8", strokeWidth: 2 },
        });
      }

      if (type === "object" && data !== null) {
        const keys = Object.keys(data);
        keys.forEach((childKey, index) =>
          processNode(
            data[childKey],
            childKey,
            id,
            level + 1,
            index,
            keys.length,
            currentPath
          )
        );
      } else if (type === "array") {
        data.forEach((item, index) =>
          processNode(
            item,
            String(index),
            id,
            level + 1,
            index,
            data.length,
            currentPath
          )
        );
      }
    }

    let rootData = inputData;
    let rootKey = null;

    if (
      inputData &&
      typeof inputData === "object" &&
      !Array.isArray(inputData) &&
      Object.keys(inputData).length === 1
    ) {
      rootKey = Object.keys(inputData)[0];
      rootData = inputData[rootKey];
    }

    processNode(rootData, rootKey, null, 0, 0, 1, "", true);
    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [inputData]);

  return (
    <div className="p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">
        JSON Tree Visualizer
      </h1>
      <div className="flex flex-col">
         <Json onJsonParsed={handleJsonParsed} />

      <div style={{ width: "100%", height: "65vh", background: "#f5f5f5" }}>
        <Search nodes={nodes} setNodes={setNodes} />
        <ReactFlow nodes={nodes} edges={edges}>
          
        </ReactFlow>
      </div>

      </div>
     
    </div>
  );
}
