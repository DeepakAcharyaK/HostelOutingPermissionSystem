import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { addDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";

function StudentDashboard() {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const fetchRequests = async (uid) => {
    const q = query(collection(db, "outingRequests"), where("studentId", "==", uid));
    const querySnapshot = await getDocs(q);

    const allRequests = [];
    querySnapshot.forEach((doc) => {
      allRequests.push({ id: doc.id, ...doc.data() });
    });

    setRequests(allRequests);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchRequests(user.uid);
      } else {
        navigate("/login");
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      // Save outing request in Firestore
      await addDoc(collection(db, "outingRequests"), {
        studentId: user.uid,
        reason,
        date,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("Request submitted successfully!");
      setReason("");
      setDate("");
      fetchRequests(user.uid); // Refresh
    } catch (error) {
      console.error(error.message);
      alert("Failed to submit request");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex flex-col flex-1 items-center bg-green-50 p-8">
        <h1 className="text-3xl font-bold mb-6 text-green-700">Student Dashboard</h1>

        {/* Outing Request Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mb-10">
          <h2 className="text-xl font-semibold mb-4 text-center">Submit Outing Request</h2>

          <textarea
            placeholder="Reason for Outing"
            className="w-full p-3 border rounded mb-4"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <input
            type="date"
            className="w-full p-3 border rounded mb-6"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
            Submit Request
          </button>
        </form>

        {/* My Requests List */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
          <h2 className="text-xl font-semibold mb-4 text-center">My Outing Requests</h2>

          {requests.length === 0 ? (
            <p className="text-center text-gray-600">No outing requests yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {requests.map((req) => (
                <div key={req.id} className="p-4 border rounded shadow-sm bg-gray-50">
                  <p><strong>Reason:</strong> {req.reason}</p>
                  <p><strong>Date:</strong> {req.date}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`${
                        req.status === "pending"
                          ? "text-yellow-500"
                          : req.status === "approved"
                          ? "text-green-600"
                          : "text-red-600"
                      } font-semibold`}
                    >
                      {req.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
