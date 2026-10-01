import {Link,NavLink,useNavigate} from "react-router-dom";
import {Home,Search,Bot,Map,GitCompare,UserCircle,LogOut,Menu,X,PlusSquare} from "lucide-react";
import {useState} from "react";
import {useAuth} from "../auth/AuthContext";
export default function Navbar(){
 const {user,logout}=useAuth();const nav=useNavigate();const [open,setOpen]=useState(false);
 const dashboard=user?.role==="OWNER"?"/owner":user?.role==="ADMIN"?"/admin":"/tenant";
 return <header className="nav"><div className="wrap navin">
  <Link to="/" className="brand" onClick={()=>setOpen(false)}><span className="brandmark"><Home size={19}/></span>Rentora</Link>
  <button className="mobileMenu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
  <nav className={open?"navlinks open":"navlinks"}>
   <NavLink to="/properties" onClick={()=>setOpen(false)}><Search size={16}/> Explore</NavLink>
   <NavLink to="/compare" onClick={()=>setOpen(false)}><GitCompare size={16}/> Compare</NavLink>
   <NavLink to="/ai" onClick={()=>setOpen(false)}><Bot size={16}/> AI Assistant</NavLink>
   <NavLink to="/map" onClick={()=>setOpen(false)}><Map size={16}/> Maps</NavLink>
   {user?<><>{user.role==="OWNER"&&<NavLink to="/owner/add" onClick={()=>setOpen(false)}><PlusSquare size={16}/> Add Property</NavLink>}</><NavLink to={dashboard} onClick={()=>setOpen(false)}><UserCircle size={16}/> Dashboard</NavLink><button className="navLogout" onClick={()=>{logout();nav("/");setOpen(false)}}><LogOut size={16}/> Logout</button></>:<><NavLink to="/login" onClick={()=>setOpen(false)}>Login</NavLink><Link className="navCta" to="/register" onClick={()=>setOpen(false)}>Get Started</Link></>}
  </nav>
 </div></header>
}
