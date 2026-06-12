import "./App.css"
import {Editor} from "@monaco-editor/react"
import {MonacoBinding} from "y-monaco"
import {useRef , useMemo , useState , useEffect} from "react"
import * as Y from "yjs"
import{ SocketIOProvider } from "y-socket.io"

function App() {

  const editorRef = useRef(null);
  const [userName , setUserName] = useState(()=>{
    return new URLSearchParams(window.location.search).get("username") || "";
  });
  const [users , setUsers] = useState([]);
  const ydoc = useMemo(() => new Y.Doc(), []);
  const ytext = useMemo(() => ydoc.getText("monaco"), [ydoc]);

const handleMount = (editor)=>{
  editorRef.current = editor;

  // const provider = new SocketIOProvider("http://localhost:3000", "monaco", ydoc ,{
  //     autoConnect : true
  //   });
  const monacoBinding = new MonacoBinding(
    ytext,
    editorRef.current.getModel(),
    new Set([editorRef.current]),
  )
}

const handleSubmit = (e) =>{
  e.preventDefault();
  setUserName(e.target.username.value);
  window.history.pushState({}, "","?username=" + e.target.username.value);
  
}


useEffect(()=>{
    console.log(userName , editorRef.current);
  if( userName){
     const provider = new SocketIOProvider("http://localhost:3000", "monaco", ydoc ,{
      autoConnect : true
    });

    provider.awareness.setLocalStateField("user", {username: userName});

    const states = Array.from(provider.awareness.getStates().values());
    console.log(states);
    setUsers(states.filter(state => state.user && state.user.username).map(state => state.user));

    provider.awareness.on("change",()=>{
      const states = Array.from(provider.awareness.getStates().values());
      setUsers(states.filter(state => state.user && state.user.username).map(state => state.user));
    })

    function handleBeforeUnload(){
      provider.awareness.setLocalStateField("user", null);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

  
  return()=>{
    provider.disconnect();
    window.removeEventListener("beforeunload", handleBeforeUnload);
  }
  }
},[userName ])

if(!userName){
  return (
    <main className=" h-screen w-full bg-gray-900 flex items-center justify-center"> 
      <form 
      className ="flex flex-col gap-4"
      onSubmit={handleSubmit}
      >
        <input 
          type="text" 
          placeholder="Enter your name"
          className="p-2 rounded-lg text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          name="username"
          />
        <button className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" >
          Join
        </button>
       </form>
    </main>
  )
}

  return (
    <main
    className = " h-screen w-full bg-gray-900 flex gap-4 p-4">

    <aside className=" w-1/4 bg-amber-50 rounded-lg ">
    
    <h2 className="text-xl font-bold p-4 border-b border-gray-300">Active Users</h2>
    <ul className="p-4">
      {users.map((user , index) =>(
        <li key={index} className="p-2 border-b border-gray-300">
          {user.username}
        </li>
      ))}
    </ul>

    </aside>

    <section className = "w-3/4 bg-neutral-800 rounded-lg overflow-hidden">
   <Editor
   height="100%"
   defaultLanguage="javascript"
   defaultValue="// some comment"
   theme="vs-dark"
    onMount={handleMount}
   />
    </section>

    </main>
   
  )
}

export default App
