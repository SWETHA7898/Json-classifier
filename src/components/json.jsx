import React, { useState } from "react";

export default function Json({ onJsonParsed }) {
  const [input, setInput] = useState("");

  const handleParse = () => {
    try {
      const json = JSON.parse(input);
      onJsonParsed(json);
    } catch {
      alert("Invalid JSON format. Please check your input.");
    }
  };

  return (
    <div className="p-4  " style={{ width: "80%" }}>
      <textarea
        className="w-full h-40 border rounded p-2"
        placeholder='Enter Json (eg.{
"user":{
"name":"Swetha",
"age":25,
"address"{
"city":"bangalore",
"pincode":560085}
  }})'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="mt-4 p-3 border rounded text-white bg-blue-500 hover:bg-blue-600"
        onClick={handleParse}
      >
        Visualize
      </button>
    </div>
  );
}
