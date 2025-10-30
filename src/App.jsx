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
      console.log(rootKey)
     console.log(rootData)
    }

    processNode(rootData, rootKey, null, 0, 0, 1, "", true);
    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [inputData]);
  

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700 drop-shadow-sm">
          JSON Tree Visualizer
        </h1>
        <p className="text-slate-600 mt-2">
          Paste your JSON below to visualize and search its structure
        </p>
      </header>

      <div className="flex gap-6 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <Json onJsonParsed={handleJsonParsed} />
        </div>

        <div className="flex-[2] bg-white p-3 rounded-xl shadow-md border border-slate-200">
          <Search nodes={nodes} setNodes={setNodes} />
          <div className="h-[65vh] mt-2 rounded-lg border border-slate-200 bg-slate-100">
            <ReactFlow nodes={nodes} edges={edges}>
              <Background color="#ddd" />

            </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  );
}
