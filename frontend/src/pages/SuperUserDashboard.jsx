import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function SuperUserDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const allUsers = [];
    querySnapshot.forEach((docSnap) => {
      allUsers.push({ id: docSnap.id, ...docSnap.data() });
    });
    setUsers(allUsers);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUsers();
      } else {
        navigate("/login");
      }
    });
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", id));
      alert("User deleted successfully");
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error(error.message);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex flex-col flex-1 items-center bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">SuperUser Dashboard</h1>

        {/* Users List */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl">
          <h2 className="text-xl font-semibold mb-4 text-center">Manage Users</h2>

          {users.length === 0 ? (
            <p className="text-center text-gray-600">No users found.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {users.map((user) => (
                <div key={user.id} className="p-4 border rounded shadow-sm bg-gray-50">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Profile Completed:</strong> {user.profileCompleted ? "Yes" : "No"}</p>
                  {user.role !== "superuser" && (
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded mt-2"
                    >
                      Delete User
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SuperUserDashboard;
