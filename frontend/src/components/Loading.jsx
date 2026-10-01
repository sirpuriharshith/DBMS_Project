export default function Loading({text="Loading Rentora..."}){
  return <div className="loading"><div className="spinner"></div><p>{text}</p></div>;
}
