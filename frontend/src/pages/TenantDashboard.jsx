import {useEffect,useState} from "react";
import {Link} from "react-router-dom";
import {ArrowRight,CalendarDays,CreditCard,FileText,Home} from "lucide-react";
import {api} from "../api";
import {useAuth} from "../auth/AuthContext";
import Loading from "../components/Loading";
export default function TenantDashboard(){
 const {user}=useAuth();const [bookings,setBookings]=useState([]);const [contracts,setContracts]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 useEffect(()=>{Promise.all([api.get("/bookings/mine"),api.get("/contracts/mine")]).then(([b,c])=>{setBookings(b.data);setContracts(c.data)}).catch(e=>setError(e.response?.data?.detail||"Could not load your dashboard")).finally(()=>setLoading(false))},[]);
 if(loading)return <section className="wrap page"><Loading/></section>;
 return <section className="wrap page"><div className="dashHero"><div><span className="eyebrow dark">TENANT DASHBOARD</span><h1>Welcome, {user?.full_name}</h1><p>Track your rental journey from one place.</p></div><div className="avatar">{user?.full_name?.[0]}</div></div>
 {error&&<div className="errorBox">{error}</div>}
 <div className="metricGrid three"><Metric I={Home} t="Active bookings" v={bookings.filter(b=>["PENDING","CONFIRMED"].includes(b.status)).length}/><Metric I={CreditCard} t="Bookings" v={bookings.length}/><Metric I={FileText} t="Contracts" v={contracts.length}/></div>
 <div className="dashSection card"><div className="sectionTitle"><h2>My bookings</h2><Link to="/properties">Find another home <ArrowRight size={15}/></Link></div>{bookings.map(b=><div className="listRow" key={b.booking_id}><div><b>{b.property_title}</b><small>{b.start_date} · {b.status}</small></div><div className="rowEnd"><strong>₹{Number(b.monthly_rent).toLocaleString()}</strong>{cLink(b)}</div></div>)}{!bookings.length&&<p className="muted">No bookings yet.</p>}</div>
 <div className="dashSection card"><div className="sectionTitle"><h2>My contracts</h2><span>{contracts.length} agreement{contracts.length===1?"":"s"}</span></div>{contracts.map(c=><div className="listRow" key={c.contract_id}><div><b>{c.contract_number}</b><small>{c.contract_status}</small></div><Link className="textLink" to={`/contract/${c.booking_id}`}>View agreement <ArrowRight size={14}/></Link></div>)}{!contracts.length&&<p className="muted">No contracts yet.</p>}</div>
 </section>
}
function cLink(b){return ["CONFIRMED","COMPLETED"].includes(b.status)?<Link className="textLink" to={`/contract/${b.booking_id}`}>Contract <ArrowRight size={13}/></Link>:null}
function Metric({I,t,v}){return <div className="metricCard card"><div className="iconbox"><I/></div><small>{t}</small><strong>{v}</strong><span>Live PostgreSQL</span></div>}
