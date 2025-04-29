import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Hostel Outing System</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-yellow-300">Home</Link>
        <Link to="/login" className="hover:text-yellow-300">Login</Link>
        <Link to="/signup" className="hover:text-yellow-300">Sign Up</Link>
      </div>
    </nav>
  );
}

export default Navbar;
