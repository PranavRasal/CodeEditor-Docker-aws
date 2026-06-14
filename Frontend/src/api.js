import axios from "axios";
import {Languages} from "./constand"

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
})
  

export const executeCode = async (code, language) => {
    const response = await API.post("/execute", {
        language: language,
        version: Languages[language],
        files: [
            {
             
                content: code
            }
        ]
    })
    return response.data;
}