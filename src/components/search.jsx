import { useState, useEffect } from "react";

function Search({ nodes, setNodes }) {
  const [searchdata, setSearch] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (searchdata.trim() === "") {
     
      
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          style: { ...node.originalStyle },
        }))
      );
      setNotFound(false);
    }
  }, [searchdata, setNodes]);

  const handleSearch = () => {
    const searchPath = searchdata.toLowerCase().trim();
    if (!searchPath) return;

    let matchFound = false;

    setNodes((prev) =>
      prev.map((node) => {
        const match =
          node.data.label?.toLowerCase().includes(searchPath) ||
          node.data.path?.toLowerCase().includes(searchPath);

        if (match) matchFound = true;

        return match
          ? {
              ...node,
              style: {
                ...node.style,
                border: "3px solid #facc15",
                backgroundColor: "#fef9c3",
                color: "#000",
                transition: "all 0.3s ease-in-out",
              },
            }
          : {
              ...node,
              style: { ...node.originalStyle },
            };
      })
    );

    setNotFound(!matchFound);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 p-2 rounded-md">
        <input
          type="text"
          placeholder="Search nodes (e.g. user.address.city)"
          className="flex-1 p-2 bg-transparent outline-none text-slate-700 placeholder-slate-400"
          value={searchdata}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {notFound ? (
      <p className="text-red-600 text-sm mt-2 font-medium text-center">
     No matches found
  </p>
) : (
  <></>
)}

    </div>
  );
}

export default Search;
