import React, { useState } from 'react'
import {executeCode} from "../api"

function output({ editorRef , language}) {

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onRun = async () => {
        const code = editorRef.current?.getValue();
        if (!code) return;

        setLoading(true);
        setError(null);
        try {
            const result = await executeCode(code, language);
            console.log("Execution result:", result);
            setResult(result);
        } catch (error) {
            console.error("Error executing code:", error);
            setError(error.response?.data?.message || error.message || "Failed to execute code");
        } finally {
            setLoading(false);
        }
    }

    const status = result?.status;
    const outputText =
        result?.stdout ||
        result?.compile_output ||
        result?.stderr ||
        (status && status.id !== 3 ? status?.description : "No output");

  return (
    <div>
        <div className='flex justify-between items-center p-4
         bg-neutral-700 border-b border-neutral-600'   >
      <h1 className='text-white text-3xl font-bold' >output</h1>
      <button
       disabled={loading}
       className={`p-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500
        h-10 w-20 text-2xl font-bold flex items-center justify-center ${
          loading ? "bg-neutral-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
         onClick={onRun}>
        {loading ? "..." : "Run"}</button></div>

        <div>
            <textarea className='w-full h-[calc(100vh-100px)] bg-neutral-800 text-white p-4
             resize-none focus:outline-none'
             readOnly
             value={loading ? "Running..." : error ? `Error: ${error}` : result ? outputText : "Output will be displayed here..."} />
             {result && (
                <div className="px-4 pb-4 text-xs text-neutral-400">
                    Status: {status?.description}
                    {result.time != null && ` | Time: ${result.time}s`}
                    {result.memory != null && ` | Memory: ${result.memory} KB`}
                </div>
             )}
        </div>

    </div>
  )
}

export default output
