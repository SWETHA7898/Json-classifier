// App.js
import React, { useState, useCallback } from "react";
import ReactFlow, { Background, Controls, ReactFlowProvider, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import Json from "./components/json";
import dagre from "dagre";

// Custom node components with enhanced styling
const ObjectNode = ({ data }) => (
  <div className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-md border border-blue-700">
    {data.label}
  </div>
);

const ArrayNode = ({ data }) => (
  <div className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold shadow-md border border-green-700">
    {data.label}
  </div>
);

const ValueNode = ({ data }) => (
  <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm shadow-md border border-gray-300">
    {data.label}
  </div>
);

const nodeTypes = {
  object: ObjectNode,
  array: ArrayNode,
  value: ValueNode
};

// Layouting function using dagre
const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "LR", ranksep: 100, nodesep: 50 }); // Adjust ranksep for more space

  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: 200, height: 40 }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const { x, y } = dagreGraph.node(node.id);
      return { ...node, position: { x: x - 100, y: y - 20 } }; // Center nodes
    }),
    edges,
  };
};

/**
 * Converts a JSON object to a React Flow node and edge tree.
 * @param {object} json The input JSON object.
 * @returns {{nodes: Array, edges: Array}} The converted nodes and edges.
 */
function jsonToNodes(json) {
  const nodes = [];
  const edges = [];
  let idCounter = 0;

  function makeNode(label, type) {
    const id = `node-${idCounter++}`;
    nodes.push({ id, data: { label }, type, position: { x: 0, y: 0 } });
    return id;
  }

  function traverse(key, value, parentId) {
    let nodeId;
    const isRoot = key === null;

    if (Array.isArray(value)) {
      nodeId = makeNode(isRoot ? "Array" : `${key} []`, "array");
      if (parentId) {
        edges.push({
          id: `${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      value.forEach((item, index) => {
        traverse(index, item, nodeId);
      });
    } else if (typeof value === "object" && value !== null) {
      nodeId = makeNode(isRoot ? "Object" : `${key} {}`, "object");
      if (parentId) {
        edges.push({
          id: `${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      Object.entries(value).forEach(([childKey, childValue]) => {
        traverse(childKey, childValue, nodeId);
      });
    } else {
      const label = `${key !== null ? `${key}: ` : ""}${JSON.stringify(value)}`;
      nodeId = makeNode(label, "value");
      if (parentId) {
        edges.push({
          id: `${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }
    }
  }

  traverse(null, json, null);

  return { nodes, edges };
}

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const handleJsonParsed = useCallback((json) => {
    const { nodes: initialNodes, edges: initialEdges } = jsonToNodes(json);
    const layouted = getLayoutedElements(initialNodes, initialEdges);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, []);

  return (
    <div className="p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">
        JSON Tree Visualizer
      </h1>
      <Json onJsonParsed={handleJsonParsed} />
      <div style={{ width: "100%", height: "65vh", background: "#f5f5f5" }}>
        <ReactFlowProvider>
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
            <Background />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default App;
