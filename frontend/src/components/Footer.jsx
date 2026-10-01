import {Home,Database,Mail} from "lucide-react";
import {Link} from "react-router-dom";
export default function Footer(){return <footer><div className="wrap footerGrid">
 <div><Link className="brand footerBrand" to="/"><span className="brandmark"><Home size={19}/></span>Rentora</Link><p>A complete digital rental platform for property owners, tenants and administrators.</p></div>
 <div><h4>Platform</h4><Link to="/properties">Properties</Link><Link to="/compare">Compare</Link><Link to="/ai">AI Assistant</Link><Link to="/map">Maps</Link></div>
 <div><h4>DBMS</h4><span><Database size={14}/> PostgreSQL</span><span>FastAPI + SQLAlchemy</span><span>JWT + RBAC</span></div>
 <div><h4>Project</h4><span><Mail size={14}/> Rental & Leasing</span><span>Academic DBMS</span><span>© 2026 Rentora</span></div>
 </div><div className="copyright">© 2026 Rentora · Online Rental Contract Booking & Payment System</div></footer>}
