import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {ArrowRight,Home,ShieldCheck,LockKeyhole,UserCog} from "lucide-react";
import {useAuth} from "../auth/AuthContext";
export default function Login(){
 const {login}=useAuth();const nav=useNavigate();
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [secondPassword,setSecondPassword]=useState("");
 const [adminStep,setAdminStep]=useState(false);const [adminUser,setAdminUser]=useState(null);const [adminChallenge,setAdminChallenge]=useState("");const [error,setError]=useState("");const [loading,setLoading]=useState(false);
 const submit=async e=>{e.preventDefault();setLoading(true);setError("");try{
   if(adminStep){
     const result=await login(adminUser.email,adminUser.primaryPassword,secondPassword,adminChallenge);
     nav("/admin");return;
   }
   const result=await login(email,password);
   if(result?.requiresSecondPassword){setAdminStep(true);setAdminUser({email,primaryPassword:password});setAdminChallenge(result.challengeToken);setSecondPassword("");return;}
   nav(result.role==="OWNER"?"/owner":result.role==="ADMIN"?"/admin":"/tenant");
 }catch(err){setError(err.response?.data?.detail||"Login failed")}finally{setLoading(false)}};
 return <Auth title={adminStep?"Verify admin access":"Welcome back"} subtitle={adminStep?"This private admin area requires a second password.":"Sign in to your Rentora account."}>
   {error&&<div className="errorBox">{error}</div>}
   {adminStep&&<div className="securityBanner"><span><ShieldCheck size={20}/></span><div><b>Admin security check</b><small>Primary password accepted. Enter the private admin password to continue.</small></div></div>}
   <form className="authForm" onSubmit={submit}>
    {!adminStep&&<label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="e.g. tenant@rentora.com" autoComplete="email"/></label>}
    {!adminStep&&<label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password"/></label>}
    {adminStep&&<label>Admin second password<div className="inputIcon"><LockKeyhole size={17}/><input autoFocus type="password" required value={secondPassword} onChange={e=>setSecondPassword(e.target.value)} placeholder="Enter private admin password" autoComplete="off"/></div></label>}
    <button className="button primary full">{loading?(adminStep?"Verifying...":"Signing in..."):(adminStep?"Enter admin console":"Sign in")} <ArrowRight size={17}/></button>
   </form>
   {!adminStep&&<div className="authLinks"><Link className="adminLoginLink" to="/admin-login"><UserCog size={15}/> Administrator? Private admin login</Link></div>}
   {adminStep?<button className="textButton" onClick={()=>{setAdminStep(false);setAdminUser(null);setAdminChallenge("");setSecondPassword("");setError("")}}>← Back to account login</button>:<p className="authFoot">New to Rentora? <Link to="/register">Create an account</Link></p>}
 </Auth>
}
function Auth({title,subtitle,children}){return <section className="authPage"><div className="authCard card"><div className="authBrand"><span className="brandmark"><Home size={19}/></span><b>Rentora</b></div><h1>{title}</h1><p>{subtitle}</p>{children}</div></section>}
