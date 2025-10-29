import { useState } from "react";


function Json({onJsonParsed}) {
    const [input, setInput] = useState('');

    const handlefunction=()=>{
        try{
            const json=JSON.parse(input)
            console.log(json)
            onJsonParsed(json
                
            )

        }
        catch{
            alert("Invalid json")

        }
    
    }
    return (
        <div className="p-4 ">

            <textarea className="w-full h-40 border rounded p-2" placeholder="Enter your JSON"
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            ></textarea>
            <button className="mt-4 p-3 border rounded text-white bg-blue-400"
            onClick={handlefunction}
            >Visualize</button>
        </div>
    );


}
export default Json