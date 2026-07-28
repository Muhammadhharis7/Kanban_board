// src/api/axios.js
import axios from "axios"

// const api = axios.create({
//     baseURL: `https://kanban-board-29kg.onrender.com/api/v1`,
//     withCredentials: true   // ← critical: sends cookies with every request
// })

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})


export default api