import axios from "axios";
import {languages} from "./constand"

const API = axios.create({
  baseURL: "https://piston.readthedocs.io/en/latest/api-v2",
})
  

export const executeCode = async (code, language) => {
    const response = await API.post("/execute", {
        language: language,
        version: languages[language],
        files: [
            {
             
                content: code
            }
        ]
    })
    return response.data;
}