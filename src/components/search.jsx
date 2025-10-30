import { useState, useEffect } from "react";

function Search({ nodes, setNodes }) {
  const [searchdata, setSearch] = useState("");
  

 
  useEffect(() => {
    if (searchdata.trim() === "") {
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({
          ...node,
          style: {
            ...node.style,
            ...node.originalStyle, 
          },
        }))
      );
    }
  }, [searchdata, setNodes]);

  const handleSearch = () => {
    console.log(nodes)
    const searchPath = searchdata.toLowerCase().trim();
    if (!searchPath) return;

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        const labelMatch = node.data.label
          ?.toLowerCase()
          .includes(searchPath);
        const pathMatch = node.data.path
          ?.toLowerCase()
          .includes(searchPath);

        const isMatch = labelMatch || pathMatch;

      
        
        if (!isMatch) return node;

       
        
        return {
          ...node,
          style: {
            ...node.style,
            border: "3px solid #FFC107",
            backgroundColor: "#FFF9C4",
            color: "#000",
            fontFamily: node.style.fontFamily || "inherit",
            fontWeight: "bold",
            transition: "all 0.3s ease-in-out",
          },
        };
      })
    );
  };

  return (
    <div
      style={{
        padding: "3px",
        background: "#fff",
        borderBottom: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
        border: "1px solid black",
        borderRadius: "10px",
        justifyContent: "space-between",
      }}
    >
      <input
        type="text"
        placeholder="Search nodes... (e.g. user.address.city)"
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          outline: "none",
        
          
        }}
        value={searchdata}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        className="p-2 border rounded text-white bg-blue-500 hover:bg-blue-600 w-max"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}

export default Search;
