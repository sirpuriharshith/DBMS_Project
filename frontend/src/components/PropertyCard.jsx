import {Link} from "react-router-dom";
import {ArrowRight,Bath,BedDouble,Heart,MapPin} from "lucide-react";
import {imageUrl} from "../api";
export default function PropertyCard({p}){
 return <article className="propertyCard card">
  <div className="propertyImage"><img src={imageUrl(p.image_url)} alt={p.title}/><span className="propertyBadge">{p.status||"AVAILABLE"}</span><span className="heartCircle"><Heart size={15}/></span></div>
  <div className="propertyBody"><div className="propertyRow"><h3>{p.title}</h3><strong>₹{Number(p.monthly_rent).toLocaleString()}</strong></div>
  <div className="location"><MapPin size={14}/>{p.area}, {p.city}</div>
  <div className="propertyMeta"><span><BedDouble size={15}/>{p.bedrooms} Beds</span><span><Bath size={15}/>{p.bathrooms} Baths</span><span>{p.furnished?"Furnished":"Unfurnished"}</span></div>
  <Link className="button darkButton full" to={`/properties/${p.property_id}`}>View property <ArrowRight size={16}/></Link></div>
 </article>}
