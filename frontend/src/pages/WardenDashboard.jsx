import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function WardenDashboard() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    const q = query(collection(db, "outingRequests"), where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);

    const allRequests = [];
    querySnapshot.forEach((docSnap) => {
      allRequests.push({ id: docSnap.id, ...docSnap.data() });
    });

    setRequests(allRequests);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchRequests();
      } else {
        navigate("/login");
      }
    });
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const requestRef = doc(db, "outingRequests", id);
      await updateDoc(requestRef, { status: newStatus });
      alert(`Request ${newStatus}`);
      fetchRequests(); // Refresh list
    } catch (error) {
      console.error(error.message);
      alert("Failed to update request status");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex flex-col flex-1 items-center bg-yellow-50 p-8">
        <h1 className="text-3xl font-bold mb-6 text-yellow-700">Warden Dashboard</h1>

        {/* Pending Requests List */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-4 text-center">Pending Outing Requests</h2>

          {requests.length === 0 ? (
            <p className="text-center text-gray-600">No pending requests.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {requests.map((req) => (
                <div key={req.id} className="p-4 border rounded shadow-sm bg-gray-100">
                  <p><strong>Reason:</strong> {req.reason}</p>
                  <p><strong>Date:</strong> {req.date}</p>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => handleUpdateStatus(req.id, "approved")}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req.id, "rejected")}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default WardenDashboard;
