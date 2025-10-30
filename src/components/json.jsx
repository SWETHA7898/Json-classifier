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
    <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200">
      <h2 className="text-lg font-semibold mb-2 text-slate-700">
        Enter JSON Data
      </h2>
      <textarea
        className="w-full h-48 border border-slate-300 rounded-md p-3 text-sm font-mono focus:ring-2 focus:ring-blue-400 outline-none"
        placeholder={`{
  "user": {
    "name": "Swetha",
    "age": 25,
    "address": {
      "city": "Bangalore",
      "pincode": 560085
    }
  }
}`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="mt-3 w-full py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-all"
        onClick={handleParse}
      >
        Visualize JSON
      </button>
    </div>
  );
}
