import axios from "axios";
import { judge0LanguageIds } from "./constand"

// Docker/served-by-backend: same origin ("/api"). Dev: vite proxy.
// Separate hosting (Vercel): set VITE_SERVER_URL to the backend URL, e.g. https://api.example.com
const BASE = import.meta.env.VITE_SERVER_URL || "";

const API = axios.create({
  baseURL: `${BASE}/api`,
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
