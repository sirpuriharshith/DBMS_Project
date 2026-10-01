import {useEffect,useState} from "react";
import {Link} from "react-router-dom";
import {ArrowRight,Building2,CalendarDays,Plus,Trash2,Wallet,ShieldAlert} from "lucide-react";
import {api,imageUrl} from "../api";
import Loading from "../components/Loading";
export default function OwnerDashboard(){
 const [stats,setStats]=useState(null);const [properties,setProperties]=useState([]);const [bookings,setBookings]=useState([]);const [contracts,setContracts]=useState([]);const [loading,setLoading]=useState(true);const [action,setAction]=useState("");const [error,setError]=useState("");
 const load=()=>Promise.all([api.get("/dashboard/owner"),api.get("/properties/owner/me"),api.get("/bookings/owner"),api.get("/contracts/owner")]).then(([s,p,b,c])=>{setStats(s.data);setProperties(p.data);setBookings(b.data);setContracts(c.data)}).finally(()=>setLoading(false));
 useEffect(()=>{load()},[]);
 const removeProperty=async id=>{if(!window.confirm("Delete this property? This cannot be undone."))return;setAction(String(id));setError("");try{await api.delete(`/properties/${id}`);await load()}catch(e){setError(e.response?.data?.detail||"Could not delete property")}finally{setAction("")}};
 if(loading)return <section className="wrap page"><Loading/></section>;
 return <section className="wrap page"><div className="dashHero"><div><span className="eyebrow dark">OWNER CONTROL CENTER</span><h1>Manage your rental business.</h1><p>Your properties, booking requests and earnings are backed by PostgreSQL.</p></div><Link to="/owner/add" className="button primary"><Plus size={17}/> Add property</Link></div>
 <div className="metricGrid three"><Metric I={Building2} t="My properties" v={stats?.properties}/><Metric I={CalendarDays} t="Bookings" v={stats?.bookings}/><Metric I={Wallet} t="Earnings" v={`₹${Number(stats?.earnings||0).toLocaleString()}`}/></div>
 {error&&<div className="errorBox">{error}</div>}
 <div className="dashSection card"><div className="sectionTitle"><div><h2>My properties</h2><p className="muted">Edit, review or remove listings from your owner account.</p></div></div><div className="ownerGrid">{properties.map(p=><div className="miniProperty" key={p.property_id}><img src={imageUrl(p.image_url)}/><div className="miniPropertyBody"><b>{p.title}</b><small>{p.area} · ₹{Number(p.monthly_rent).toLocaleString()} · {p.status}</small><div className="miniActions"><Link to={`/properties/${p.property_id}`}>View <ArrowRight size={13}/></Link><button className="dangerButton" disabled={action===String(p.property_id)} onClick={()=>removeProperty(p.property_id)}><Trash2 size={14}/>{action===String(p.property_id)?"Deleting…":"Delete"}</button></div></div></div>)}</div>{!properties.length&&<p className="muted">No properties yet. Use Add property.</p>}</div>
 <div className="dashSection card"><div className="sectionTitle"><h2>Booking requests</h2><span>{bookings.length} total</span></div>{bookings.map(b=><BookingRow key={b.booking_id} b={b} onChanged={load} action={action} setAction={setAction} setError={setError}/>) }{!bookings.length&&<p className="muted">No booking requests.</p>}</div>
 <div className="dashSection card"><div className="sectionTitle"><div><h2>Rental agreements</h2><p className="muted">Confirm an agreement after the tenant has signed.</p></div><span>{contracts.length} total</span></div>{contracts.map(c=><ContractRow key={c.contract_id} c={c} onChanged={load} action={action} setAction={setAction} setError={setError}/>) }{!contracts.length&&<p className="muted">No rental agreements yet.</p>}</div>
 </section>
}
function BookingRow({b,onChanged,action,setAction,setError}){
 const confirm=async()=>{setAction(`booking-${b.booking_id}`);setError("");try{await api.patch(`/bookings/${b.booking_id}/status`,{status:"CONFIRMED"});await onChanged()}catch(e){setError(e.response?.data?.detail||"Could not confirm booking")}finally{setAction("")}};
 return <div className="listRow"><div><b>{b.property_title}</b><small>{b.tenant_name} · {b.status}</small></div><div className="rowEnd">{b.status==="PENDING"&&<button className="button smallButton" disabled={action===`booking-${b.booking_id}`} onClick={confirm}>{action===`booking-${b.booking_id}`?"Confirming…":"Accept booking"}</button>}<span className={b.status==="CONFIRMED"?"statusGood":"statusPending"}>{b.status}</span></div></div>
}
function ContractRow({c,onChanged,action,setAction,setError}){
 const confirm=async()=>{setAction(`contract-${c.contract_id}`);setError("");try{await api.patch(`/contracts/${c.contract_id}/owner-confirm`);await onChanged()}catch(e){setError(e.response?.data?.detail||"Could not confirm agreement")}finally{setAction("")}};
 return <div className="listRow"><div><b>{c.contract_number}</b><small>{c.property_title} · Tenant signed: {c.tenant_signed?"Yes":"No"}</small></div><div className="rowEnd">{c.owner_signed?<span className="statusGood">AGREEMENT CONFIRMED</span>:c.tenant_signed?<button className="button smallButton" disabled={action===`contract-${c.contract_id}`} onClick={confirm}>{action===`contract-${c.contract_id}`?"Confirming…":"Confirm agreement"}</button>:<span className="statusPending">Awaiting tenant</span>}</div></div>
}
function Metric({I,t,v}){return <div className="metricCard card"><div className="iconbox"><I/></div><small>{t}</small><strong>{v}</strong><span>Live PostgreSQL</span></div>}
