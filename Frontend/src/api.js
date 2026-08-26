import axios from "axios";
import { judge0LanguageIds } from "./constand"

// In production the frontend is served by the backend (same origin).
// In dev, vite proxy forwards /api to http://localhost:3000
const API = axios.create({
  baseURL: "/api",
})

export const executeCode = async (code, language, stdin = "") => {
    const languageId = judge0LanguageIds[language];

    if (!languageId) {
        throw new Error(`Language "${language}" is not supported`);
    }

    const response = await API.post("/compile", {
        source_code: code,
        language_id: languageId,
        stdin,
    })
    return response.data;
}
