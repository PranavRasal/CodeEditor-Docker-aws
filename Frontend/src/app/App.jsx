import "./App.css"
import {Editor} from "@monaco-editor/react"
import {MonacoBinding} from "y-monaco"
import {useRef , useMemo , useState , useEffect} from "react"
import * as Y from "yjs"
import{ SocketIOProvider } from "y-socket.io"
import LanguageSelector from "../components/languageSelecter"
import {snippets} from "../constand"
import Output from "../components/output"

function App() {

  const editorRef = useRef(null);
  const [userName , setUserName] = useState(()=>{
    return new URLSearchParams(window.location.search).get("username") || "";
  });
  const [users , setUsers] = useState([]);
  const ydoc = useMemo(() => new Y.Doc(), []);
  const ytext = useMemo(() => ydoc.getText("monaco"), [ydoc]);


  const [value , setValue] = useState("");
  const [language, setLanguage] = useState("javascript");

  // Works on every device: same origin in production (docker), proxied in dev
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || window.location.origin;

  const onSelect = (lang) => {
    setLanguage(lang);
    setValue(snippets[lang] || "");
  };



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




useEffect(()=>{
    
  if( userName){
     const provider = new SocketIOProvider(SERVER_URL, "monaco", ydoc ,{
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
},[userName , SERVER_URL])


const handleSubmit = (e) =>{ // Handle the form submission
  e.preventDefault();
  setUserName(e.target.username.value);
  window.history.pushState({}, "","?username=" + e.target.username.value);
  
}

if(!userName){ // If the user has not entered a username, show the input form 
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
//  console.log(value);

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
    <LanguageSelector  language={language} onSelect={onSelect}/>
    <div className="h-[calc(100vh-200px)]">
   <Editor   
   height="70%"
   language={language}
   defaultLanguage={language}
   defaultValue="// some comment"
   theme="vs-dark"
   value={value}
   onChange={(value) => setValue(value)}
    onMount={handleMount}
   />
   <Output  editorRef={editorRef} language={language} />
   </div>
  
    </section>

    </main>
   
  )
}

export default App
