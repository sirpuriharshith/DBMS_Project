import {useEffect,useState} from "react";
import {useNavigate,useParams} from "react-router-dom";
import {api} from "../api";
import Loading from "../components/Loading";
import {ArrowRight,CalendarDays} from "lucide-react";
export default function Booking(){
 const {id}=useParams();const nav=useNavigate();const [p,setP]=useState(null);const [date,setDate]=useState("");const [error,setError]=useState("");
 useEffect(()=>{api.get(`/properties/${id}`).then(r=>setP(r.data)).catch(e=>setError(e.response?.data?.detail||"Unavailable"))},[id]);
 const submit=async()=>{try{const {data}=await api.post("/bookings",{property_id:Number(id),start_date:date});nav(`/payment/${data.booking_id}`)}catch(e){setError(e.response?.data?.detail||"Booking failed")}};
 if(error&&!p)return <section className="wrap page narrow"><div className="errorBox">{error}</div></section>;if(!p)return <section className="wrap page narrow"><Loading/></section>;
 return <section className="wrap page narrow"><div className="stepper"><b>01 Booking</b><i></i><span>02 Payment</span><i></i><span>03 Contract</span></div><div className="formCard card"><span className="eyebrow dark">RESERVE YOUR HOME</span><h1>Book {p.title}</h1><p className="muted">Choose a move-in date to continue.</p>{error&&<div className="errorBox">{error}</div>}<label>Move-in date<div className="inputIcon"><CalendarDays/><input type="date" value={date} min={new Date().toISOString().slice(0,10)} onChange={e=>setDate(e.target.value)}/></div></label><label>Rental period<select defaultValue="11"><option>11 months</option><option>6 months</option><option>12 months</option></select></label><div className="bookingSummary"><span>Monthly rent <b>₹{Number(p.monthly_rent).toLocaleString()}</b></span><span>Booking amount <b>₹{Math.round(Number(p.monthly_rent)*.1).toLocaleString()}</b></span></div><button disabled={!date} className="button primary full" onClick={submit}>Continue to payment <ArrowRight/></button></div></section>
}
