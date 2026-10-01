import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {ArrowRight,Bot,Building2,CalendarDays,CheckCircle2,CreditCard,FileText,MapPin,Search,ShieldCheck,Sparkles,Users} from "lucide-react";
import PropertyCard from "../components/PropertyCard";
const featured=[
 {property_id:1,title:"Skyline 2BHK",city:"Hyderabad",area:"Kondapur",monthly_rent:28000,bedrooms:2,bathrooms:2,furnished:true,status:"AVAILABLE",image_url:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"},
 {property_id:2,title:"Green Valley 3BHK",city:"Hyderabad",area:"Gachibowli",monthly_rent:42000,bedrooms:3,bathrooms:3,furnished:true,status:"AVAILABLE",image_url:"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85"},
 {property_id:3,title:"Urban Studio",city:"Hyderabad",area:"Madhapur",monthly_rent:18000,bedrooms:1,bathrooms:1,furnished:true,status:"AVAILABLE",image_url:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85"}];
export default function Home(){
 const nav=useNavigate();const [q,setQ]=useState("");
 return <>
 <section className="hero"><div className="heroGlow glowA"></div><div className="heroGlow glowB"></div><div className="wrap heroGrid">
  <div className="heroCopy reveal"><div className="eyebrow"><Sparkles size={14}/> THE SMART WAY TO RENT</div><h1>Find a place<br/>you can call <span>home.</span></h1>
   <p>Rentora connects property owners and tenants through one digital rental journey — discovery, booking, payments and contracts.</p>
   <form className="heroSearch" onSubmit={e=>{e.preventDefault();nav(`/properties?q=${encodeURIComponent(q)}`)}}><Search size={20}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search Hyderabad, Kondapur, 2BHK..."/><button>Search</button></form>
   <div className="trustRow"><span><ShieldCheck size={16}/> Secure rentals</span><span><FileText size={16}/> Digital contracts</span><span><CreditCard size={16}/> Online payments</span></div>
  </div>
  <div className="heroVisual floating"><div className="heroPhotoCard"><img src={featured[0].image_url}/><div className="heroPhotoInfo"><span>FEATURED PROPERTY</span><b>Skyline 2BHK</b><small><MapPin size={13}/> Kondapur · ₹28,000/month</small></div></div><div className="miniStat"><strong>24/7</strong><span>Rental assistance</span></div></div>
 </div></section>

 <section className="wrap section"><div className="centerTitle"><span className="eyebrow dark">ABOUT RENTORA</span><h2>A complete digital ecosystem for modern rental management.</h2><p>Designed around the full rental lifecycle described in the project abstract.</p></div>
 <div className="aboutGrid">
  <div className="aboutText card"><div className="iconbox"><Building2/></div><h3>For property owners</h3><p>Owners can create an account, publish rental properties, maintain availability, receive booking requests and monitor activity from one dashboard.</p></div>
  <div className="aboutText card"><div className="iconbox"><Users/></div><h3>For tenants</h3><p>Tenants can register, search available homes, filter by budget and location, inspect detailed listings and complete the booking process online.</p></div>
  <div className="aboutText card"><div className="iconbox"><CreditCard/></div><h3>Secure digital workflow</h3><p>Rentora connects property, booking, payment and contract information through a relational PostgreSQL database and FastAPI service layer.</p></div>
  <div className="aboutText card"><div className="iconbox"><Bot/></div><h3>Intelligent assistance</h3><p>The Rentora AI assistant is focused on website-specific questions such as property search, booking, payments, contracts, owners, tenants and administration.</p></div>
 </div>
 <div className="aboutWide card"><div className="iconbox"><MapPin/></div><div><h3>Location discovery and comparison</h3><p>Rentora provides Google Maps-based location viewing and directions, while comparison tools help users compare rent, distance, type, bedrooms, amenities and availability.</p></div></div>
 </section>

 <section className="wrap section"><div className="sectionHead"><div><span className="eyebrow dark">HOW IT WORKS</span><h2>One journey from search to contract.</h2></div></div>
 <div className="stepsGrid">{[[Search,"01","Discover","Search and filter available rental properties."],[CalendarDays,"02","Book","Select a move-in date and rental period."],[CreditCard,"03","Pay","Complete the booking payment and store the transaction."],[FileText,"04","Contract","Generate and manage the digital rental agreement."]].map(([I,n,t,d])=><div className="stepCard card" key={n}><div className="stepNo">{n}</div><I/><h3>{t}</h3><p>{d}</p></div>)}</div></section>

 <section className="wrap section"><div className="sectionHead"><div><span className="eyebrow dark">FEATURED HOMES</span><h2>Explore rental properties.</h2></div><Link className="textLink" to="/properties">View all <ArrowRight size={16}/></Link></div><div className="propertyGrid">{featured.map(p=><PropertyCard p={p} key={p.property_id}/>)}</div></section>

 <section className="wrap roleBand"><div className="roleCard"><div className="roleIcon"><Building2/></div><h3>Owner</h3><p>Add and manage rental properties, booking requests and earnings.</p><Link to="/register" className="textLink">Create owner account <ArrowRight size={15}/></Link></div><div className="roleCard"><div className="roleIcon"><Users/></div><h3>Tenant</h3><p>Discover homes and complete booking, payment and contract steps.</p><Link to="/register" className="textLink">Start as tenant <ArrowRight size={15}/></Link></div><div className="roleCard"><div className="roleIcon"><Bot/></div><h3>Rentora AI</h3><p>Ask questions about the complete website and rental workflow.</p><Link to="/ai" className="textLink">Ask assistant <ArrowRight size={15}/></Link></div></section>
 </>}
