import axios from "axios";
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
export const api = axios.create({baseURL:API_BASE,headers:{"Content-Type":"application/json"}});
api.interceptors.request.use(config=>{
  const token=localStorage.getItem("rentora_token");
  if(token) config.headers.Authorization=`Bearer ${token}`;
  return config;
});
export const imageUrl=url=>url||"https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85";
