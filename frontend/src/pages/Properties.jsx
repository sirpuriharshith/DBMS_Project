import {useEffect,useState} from "react";
import {useSearchParams,Link} from "react-router-dom";
import {api} from "../api";
import Loading from "../components/Loading";
import PropertyCard from "../components/PropertyCard";
export default function Properties(){
 const [params]=useSearchParams();const [q,setQ]=useState(params.get("q")||"");const [type,setType]=useState("");const [max,setMax]=useState("");const [beds,setBeds]=useState("");const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 useEffect(()=>{const t=setTimeout(()=>{api.get("/properties",{params:{q,property_type:type,max_rent:max||undefined,bedrooms:beds||undefined}}).then(r=>{setItems(r.data);setError("")}).catch(()=>setError("Unable to load properties. Start FastAPI on port 8000.")).finally(()=>setLoading(false))},200);return()=>clearTimeout(t)},[q,type,max,beds]);
 return <section className="wrap page"><div className="pageIntro"><span className="eyebrow dark">PROPERTY MARKETPLACE</span><h1>Explore rental properties</h1><p>Live inventory from the Rentora PostgreSQL database.</p></div>
 <div className="filterPanel card"><div><label>Search</label><input value={q} onChange={e=>setQ(e.target.value)} placeholder="City, area or property"/></div><div><label>Type</label><select value={type} onChange={e=>setType(e.target.value)}><option value="">All types</option><option>APARTMENT</option><option>HOUSE</option><option>VILLA</option></select></div><div><label>Maximum rent</label><input type="number" value={max} onChange={e=>setMax(e.target.value)} placeholder="₹ / month"/></div><div><label>Bedrooms</label><select value={beds} onChange={e=>setBeds(e.target.value)}><option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select></div></div>
 {error&&<div className="errorBox">{error}</div>}{loading?<Loading/>:<><div className="resultBar"><b>{items.length}</b> properties found <Link to="/compare">Compare →</Link></div><div className="propertyGrid">{items.map(p=><PropertyCard key={p.property_id} p={p}/>)}</div>{!items.length&&<div className="emptyState card">No properties found.</div>}</>}</section>
}
