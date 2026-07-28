// src/api/axios.js
import axios from "axios"

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
    withCredentials: true   // ← critical: sends cookies with every request
})

export default api