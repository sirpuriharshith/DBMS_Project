import {useState} from "react";
import {useNavigate,useParams} from "react-router-dom";
import {api} from "../api";
import {ArrowRight,CheckCircle2,CreditCard} from "lucide-react";
export default function Payment(){
 const {id}=useParams();const nav=useNavigate();const [done,setDone]=useState(false);const [ref,setRef]=useState("");const [error,setError]=useState("");
 const pay=async()=>{try{const {data}=await api.post("/payments",{booking_id:Number(id)});setRef(data.transaction_ref);setDone(true)}catch(e){setError(e.response?.data?.detail||"Payment failed")}};
 return <section className="wrap page narrow"><div className="stepper"><span>01 Booking</span><i></i><b>02 Payment</b><i></i><span>03 Contract</span></div><div className="formCard card"><span className="eyebrow dark">SECURE CHECKOUT</span><h1>Complete your payment</h1><p className="muted">The local build records the payment transaction in PostgreSQL. Razorpay can replace this demo gateway later.</p>{error&&<div className="errorBox">{error}</div>}{!done?<><div className="paymentBox"><CreditCard/><div><b>Rentora Demo Checkout</b><small>PostgreSQL transaction record</small></div><strong>Booking payment</strong></div><button className="button primary full" onClick={pay}>Pay securely <ArrowRight/></button></>:<><div className="successBox"><CheckCircle2/><div><b>Payment successful</b><span>{ref}</span></div></div><button className="button primary full" onClick={()=>nav(`/contract/${id}`)}>Generate rental contract <ArrowRight/></button></>}</div></section>
}
