import React from 'react'
import {executeCode} from "../api"

function output({ editorRef , language}) {

    const onRun = async () => {
        const code = editorRef.current.getValue();
        console.log("code to run", code);
        // Here you can add logic to send the code to your backend for execution
        try {
            const result = await executeCode(code, language);
            console.log("Execution result:", result);
        } catch (error) {
            console.error("Error executing code:", error);
        }
    }
  return (
    <div>
        <div className='flex justify-between items-center p-4
         bg-neutral-700 border-b border-neutral-600'   >
      <h1 className='text-white text-3xl font-bold' >output</h1>
      <button className='bg-blue-500 text-white p-2 rounded-lg
       hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
        h-10 w-20 text-3xl font-bold flex items-center justify-center '
         onClick={onRun}>
        Run</button></div>
        <div>
            <textarea className='w-full h-[calc(100vh-100px)] bg-neutral-800 text-white p-4
             resize-none focus:outline-none' readOnly value={"Output will be displayed here..."} /> 
        </div>

    </div>
  )
}

export default output
