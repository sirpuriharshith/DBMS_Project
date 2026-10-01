import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ArrowRight,Building2} from "lucide-react";
import {api} from "../api";
export default function OwnerAddProperty(){
 const nav=useNavigate();const [f,setF]=useState({title:"",description:"",property_type:"APARTMENT",city:"Hyderabad",area:"",address:"",latitude:"",longitude:"",monthly_rent:"",bedrooms:2,bathrooms:2,furnished:true,image_url:""});const [error,setError]=useState("");const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const submit=async e=>{e.preventDefault();try{await api.post("/properties",{...f,monthly_rent:Number(f.monthly_rent),bedrooms:Number(f.bedrooms),bathrooms:Number(f.bathrooms),latitude:f.latitude?Number(f.latitude):null,longitude:f.longitude?Number(f.longitude):null});nav("/owner")}catch(e){setError(e.response?.data?.detail||"Unable to create property")}};
 return <section className="wrap page narrow"><div className="formCard card"><div className="iconbox"><Building2/></div><span className="eyebrow dark">OWNER LISTING</span><h1>Add your rental property</h1><p className="muted">This form creates a real property record in PostgreSQL.</p>{error&&<div className="errorBox">{error}</div>}<form className="authForm" onSubmit={submit}>
 <label>Property title<input required value={f.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Lakeview 2BHK"/></label>
 <label>Description<textarea required rows="4" value={f.description} onChange={e=>set("description",e.target.value)} placeholder="Describe the property"/></label>
 <div className="twoCol"><label>Type<select value={f.property_type} onChange={e=>set("property_type",e.target.value)}><option>APARTMENT</option><option>HOUSE</option><option>VILLA</option></select></label><label>Monthly rent<input type="number" required value={f.monthly_rent} onChange={e=>set("monthly_rent",e.target.value)}/></label></div>
 <div className="twoCol"><label>City<input value={f.city} onChange={e=>set("city",e.target.value)}/></label><label>Area<input required value={f.area} onChange={e=>set("area",e.target.value)}/></label></div>
 <div className="twoCol"><label>Bedrooms<input type="number" min="1" value={f.bedrooms} onChange={e=>set("bedrooms",e.target.value)}/></label><label>Bathrooms<input type="number" min="1" value={f.bathrooms} onChange={e=>set("bathrooms",e.target.value)}/></label></div>
 <label>Image URL<input value={f.image_url} onChange={e=>set("image_url",e.target.value)} placeholder="Optional image URL"/></label>
 <div className="twoCol"><label>Latitude<input value={f.latitude} onChange={e=>set("latitude",e.target.value)} placeholder="17.45"/></label><label>Longitude<input value={f.longitude} onChange={e=>set("longitude",e.target.value)} placeholder="78.38"/></label></div>
 <button className="button primary full">Publish property <ArrowRight/></button></form></div></section>
}
