import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import { YSocketIO } from "y-socket.io/dist/server"
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

const httpServer = createServer(app);


const io = new Server(httpServer ,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const ySocketIO = new YSocketIO(io);
ySocketIO.initialize();

app.get('/' , (req , res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
})

app.get("/health" , (req , res)=>{
    res.status(200).json({
        message : "ok",
        success : true
    })
})

const port = process.env.PORT || 3000;

httpServer.listen(port ,()=>{
    console.log(`Server is running on port ${port}`);
})
