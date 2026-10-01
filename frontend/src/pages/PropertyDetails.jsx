import {useEffect,useState} from "react";
import {useNavigate,useParams} from "react-router-dom";
import {ArrowRight,Bath,BedDouble,CheckCircle2,Heart,MapPin} from "lucide-react";
import {api,imageUrl} from "../api";
import Loading from "../components/Loading";
export default function PropertyDetails(){
 const {id}=useParams();const nav=useNavigate();const [p,setP]=useState(null);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 useEffect(()=>{api.get(`/properties/${id}`).then(r=>setP(r.data)).catch(()=>setError("Property not found")).finally(()=>setLoading(false))},[id]);
 if(loading)return <section className="wrap page"><Loading/></section>;if(error)return <section className="wrap page"><div className="emptyState card">{error}</div></section>;
 return <section className="wrap page"><div className="detailGrid"><div className="detailPhoto"><img src={imageUrl(p.image_url)} alt={p.title}/><span className="detailBadge">{p.status}</span></div><div className="detailPanel card"><div className="detailTop"><span className="eyebrow dark">{p.property_type}</span><button><Heart/></button></div><h1>{p.title}</h1><div className="location big"><MapPin size={17}/>{p.area}, {p.city}</div><div className="detailPrice">₹{Number(p.monthly_rent).toLocaleString()} <small>/ month</small></div><div className="detailStats"><span><BedDouble/>{p.bedrooms} Bedrooms</span><span><Bath/>{p.bathrooms} Bathrooms</span><span>{p.furnished?"Furnished":"Unfurnished"}</span></div><p className="detailDescription">{p.description}</p><div className="checklist"><span><CheckCircle2/> Digital booking</span><span><CheckCircle2/> Secure payment record</span><span><CheckCircle2/> Rental contract</span><span><CheckCircle2/> Google Maps directions</span></div><button className="button primary full" onClick={()=>nav(`/booking/${p.property_id}`)}>Book this property <ArrowRight/></button></div></div></section>
}
