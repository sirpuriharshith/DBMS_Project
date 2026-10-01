import {useEffect,useState} from "react";
import {Activity,ArrowUpRight,Building2,CalendarDays,Database,FileText,LockKeyhole,ShieldCheck,Users,Wallet} from "lucide-react";
import {api} from "../api";
import Loading from "../components/Loading";
export default function AdminDashboard(){
 const [s,setS]=useState(null);const [error,setError]=useState("");
 useEffect(()=>{api.get("/dashboard/admin").then(r=>setS(r.data)).catch(e=>setError(e.response?.data?.detail||"Admin data unavailable"))},[]);
 if(error)return <section className="wrap page"><div className="errorBox">{error}</div></section>;if(!s)return <section className="wrap page"><Loading/></section>;
 const totalUsers=Math.max(Number(s.users)||0,1);const tenantPct=Math.round((Number(s.tenants||0)/totalUsers)*100);const ownerPct=Math.round((Number(s.owners||0)/totalUsers)*100);const availPct=s.properties?Math.round((Number(s.available_properties||0)/Number(s.properties))*100):0;
 return <section className="wrap page adminPage">
  <div className="adminHero"><div><span className="eyebrow dark">PRIVATE ADMIN CONSOLE</span><h1>Control the Rentora platform.</h1><p>Monitor users, properties, bookings, contracts and payments from one secure dashboard.</p></div><div className="adminSecurity"><span><ShieldCheck size={19}/></span><div><b>2-step authentication</b><small>Admin access verified</small></div></div></div>
  <div className="metricGrid four adminMetrics"><Metric I={Users} t="Total users" v={s.users}/><Metric I={Building2} t="Properties" v={s.properties}/><Metric I={CalendarDays} t="Bookings" v={s.bookings}/><Metric I={Wallet} t="Revenue" v={`₹${Number(s.revenue||0).toLocaleString()}`}/></div>
  <div className="adminGrid">
   <div className="adminMain">
    <div className="dashSection card adminPanel"><div className="sectionTitle"><div><h2>Platform snapshot</h2><p className="muted">Current records from PostgreSQL.</p></div><span className="liveTag"><span/> Live</span></div><div className="snapshotGrid"><Snapshot icon={Users} label="Tenants" value={s.tenants} detail={`${tenantPct}% of users`}/><Snapshot icon={Users} label="Owners" value={s.owners} detail={`${ownerPct}% of users`}/><Snapshot icon={Building2} label="Available homes" value={s.available_properties} detail={`${availPct}% of properties`}/><Snapshot icon={FileText} label="Contracts" value={s.contracts} detail="Rental agreements"/></div></div>
    <div className="dashSection card adminPanel"><div className="sectionTitle"><div><h2>Recent activity</h2><p className="muted">Latest platform events.</p></div><Activity size={19}/></div>{s.activities.map((a,i)=><div className="activityRow" key={i}><span className="activityDot"></span><div><b>{a.action}</b><small>{a.description}</small></div><time>{new Date(a.created_at).toLocaleString()}</time></div>)}</div>
   </div>
   <aside className="adminSide">
    <div className="secureCard card"><div className="secureIcon"><LockKeyhole size={21}/></div><span className="eyebrow dark">ACCESS CONTROL</span><h3>Admin area is restricted</h3><p>Only accounts with the ADMIN role can reach this console. A second private password is required during login.</p><div className="secureRow"><ShieldCheck size={16}/><span>Role-based access</span><b>ON</b></div><div className="secureRow"><Database size={16}/><span>PostgreSQL live data</span><b>ON</b></div></div>
    <div className="dashSection card adminPanel quickPanel"><div className="sectionTitle"><h2>System totals</h2><ArrowUpRight size={18}/></div><div className="quickRow"><span>Successful payments</span><b>{s.successful_payments??"—"}</b></div><div className="quickRow"><span>Available properties</span><b>{s.available_properties}</b></div><div className="quickRow"><span>Rental contracts</span><b>{s.contracts}</b></div><div className="quickRow"><span>Total bookings</span><b>{s.bookings}</b></div></div>
   </aside>
  </div>
 </section>
}
function Metric({I,t,v}){return <div className="metricCard card adminMetric"><div className="iconbox"><I/></div><small>{t}</small><strong>{v}</strong><span>Protected admin data</span></div>}
function Snapshot({icon:Icon,label,value,detail}){return <div className="snapshotCard"><div className="snapshotIcon"><Icon size={18}/></div><div><small>{label}</small><strong>{value}</strong><span>{detail}</span></div></div>}
