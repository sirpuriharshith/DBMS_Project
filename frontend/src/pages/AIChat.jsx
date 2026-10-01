import {useState} from "react";
import {ArrowRight,Bot,Sparkles} from "lucide-react";
import {api} from "../api";
export default function AIChat(){
 const [q,setQ]=useState("");const [messages,setMessages]=useState([{role:"ai",text:"Hi! I’m Rentora AI. Ask about properties, owners, tenants, bookings, payments, contracts, admin or maps."}]);const [loading,setLoading]=useState(false);
 const send=async()=>{if(!q.trim())return;const text=q;setQ("");setMessages(m=>[...m,{role:"user",text}]);setLoading(true);try{const {data}=await api.post("/ai/chat",{message:text});setMessages(m=>[...m,{role:"ai",text:data.reply}])}catch{setMessages(m=>[...m,{role:"ai",text:"Please make sure the FastAPI server is running."}])}finally{setLoading(false)}};
 return <section className="wrap page narrow"><div className="aiPage card"><div className="aiHeader"><div className="aiLogo"><Bot/></div><div><span className="eyebrow">RENTORA AI</span><h1>Rental assistant</h1><p>Website-specific help for Rentora.</p></div></div><div className="chatMessages">{messages.map((m,i)=><div className={m.role==="user"?"chatMsg user":"chatMsg"} key={i}>{m.role==="ai"&&<Sparkles size={14}/>}<span>{m.text}</span></div>)}</div><div className="chatInput"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="e.g. How does booking work?"/><button onClick={send} disabled={loading}><ArrowRight/></button></div></div></section>
}
