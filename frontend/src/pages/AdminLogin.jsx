import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {ArrowRight,Home,LockKeyhole,ShieldCheck,ArrowLeft} from "lucide-react";
import {useAuth} from "../auth/AuthContext";
import {api} from "../api";
export default function AdminLogin(){
 const {login}=useAuth();const nav=useNavigate();
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [second,setSecond]=useState("");const [step,setStep]=useState(1);const [challenge,setChallenge]=useState("");const [loading,setLoading]=useState(false);const [error,setError]=useState("");
 const submit=async e=>{e.preventDefault();setLoading(true);setError("");try{
   if(step===1){
     const {data}=await api.post("/auth/login",{email,password});
     if(!data.requires_second_password){throw new Error("This account is not an administrator account")}
     setChallenge(data.challenge_token);setStep(2);return;
   }
   const {data}=await api.post("/auth/admin/verify-second",{challenge_token:challenge,second_password:second});
   localStorage.setItem("rentora_token",data.access_token);localStorage.setItem("rentora_user",JSON.stringify(data.user));
   window.location.href="/admin";
 }catch(err){setError(err.response?.data?.detail||err.message||"Admin login failed")}finally{setLoading(false)}};
 return <section className="authPage"><div className="authCard card"><Link to="/login" className="textLink inlineBack"><ArrowLeft size={15}/> Back to user login</Link><div className="authBrand"><span className="brandmark"><Home size={19}/></span><b>Rentora</b></div><span className="eyebrow dark">PRIVATE ADMIN ACCESS</span><h1>{step===1?"Administrator login":"Second verification"}</h1><p>{step===1?"Use your administrator account credentials.":"Enter the private second password to open the admin console."}</p>{error&&<div className="errorBox">{error}</div>}
 <form className="authForm" onSubmit={submit}>{step===1?<><label>Admin email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="e.g. admin@rentora.com" autoComplete="username"/></label><label>Admin password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter admin password" autoComplete="current-password"/></label></>:<><div className="securityBanner"><span><ShieldCheck size={20}/></span><div><b>Two-step authentication</b><small>Primary administrator password accepted.</small></div></div><label>Private second password<div className="inputIcon"><LockKeyhole size={17}/><input autoFocus type="password" required value={second} onChange={e=>setSecond(e.target.value)} placeholder="Enter private admin password" autoComplete="off"/></div></label></>}<button className="button primary full" disabled={loading}>{loading?"Verifying...":step===1?"Continue to verification":"Open admin console"} <ArrowRight size={17}/></button></form></div></section>
}
