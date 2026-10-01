import {useEffect,useState} from "react";
import {api} from "../api";
import {ExternalLink,MapPin,Navigation} from "lucide-react";
import Loading from "../components/Loading";
export default function MapPage(){
 const [items,setItems]=useState([]);const [selected,setSelected]=useState(null);useEffect(()=>{api.get("/properties").then(r=>{setItems(r.data);setSelected(r.data[0]||null)})},[]);
 if(!selected)return <section className="wrap page"><Loading/></section>;
 const q=encodeURIComponent(`${selected.title}, ${selected.area}, ${selected.city}`);const map=`https://www.google.com/maps?q=${q}&output=embed`;const directions=`https://www.google.com/maps/dir/?api=1&destination=${q}`;
 return <section className="wrap page"><div className="pageIntro"><span className="eyebrow dark">LOCATION DISCOVERY</span><h1>Rentora Google Maps</h1><p>View properties, open the location in Google Maps and get directions.</p></div><div className="mapLayout"><div className="mapPanel card"><iframe title="Google Maps property location" src={map} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe></div><div className="mapList card"><h2>Rental locations</h2>{items.map(p=><button className={selected.property_id===p.property_id?"mapItem selected":"mapItem"} key={p.property_id} onClick={()=>setSelected(p)}><MapPin/><div><b>{p.title}</b><small>{p.area} · ₹{Number(p.monthly_rent).toLocaleString()}</small></div></button>)}<a className="button primary full" href={directions} target="_blank" rel="noreferrer"><Navigation size={16}/> Directions <ExternalLink size={14}/></a></div></div></section>
}
