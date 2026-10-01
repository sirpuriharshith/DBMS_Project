import {createContext,useContext,useState} from "react";
import {api} from "../api";
const AuthContext=createContext(null);
function persist(data,setUser){
  localStorage.setItem("rentora_token",data.access_token);localStorage.setItem("rentora_user",JSON.stringify(data.user));setUser(data.user);return data.user;
}
export function AuthProvider({children}){
  const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem("rentora_user")||"null")}catch{return null}});
  const login=async(email,password,secondPassword="",challengeToken="")=>{
    const {data}=await api.post("/auth/login",{email,password});
    if(data.requires_second_password){
      if(!secondPassword) return {requiresSecondPassword:true,challengeToken:data.challenge_token,user:data.user};
      const verified=await api.post("/auth/admin/verify-second",{challenge_token:challengeToken || data.challenge_token,second_password:secondPassword});
      return persist(verified.data,setUser);
    }
    return persist(data,setUser);
  };
  const register=async(payload)=>{const {data}=await api.post("/auth/register",payload);return persist(data,setUser)};
  const logout=()=>{localStorage.removeItem("rentora_token");localStorage.removeItem("rentora_user");setUser(null)};
  return <AuthContext.Provider value={{user,login,register,logout}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
