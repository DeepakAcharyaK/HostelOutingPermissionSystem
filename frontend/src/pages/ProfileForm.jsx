import { useState } from "react";
import { auth, db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ProfileForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    yearOfStudy: "",
    branch: "",
    hostelBlock: "",
    roomNumber: "",
    outingType: "Outing",
    requestMessage: "",
    photoURL: "",
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;

      if (!user) {
        alert("User not logged in.");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);

      await updateDoc(userDocRef, {
        ...formData,
        profileCompleted: true,
      });

      alert("Profile updated successfully!");

      // Fetch role from local storage or refetch if needed
      // Directly redirect to student dashboard for now
      navigate("/student-dashboard");
    } catch (error) {
      console.error(error);
      alert("Error updating profile: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-purple-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="yearOfStudy"
              placeholder="Year of Study"
              value={formData.yearOfStudy}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="branch"
              placeholder="Academic Branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="hostelBlock"
              placeholder="Hostel Block"
              value={formData.hostelBlock}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="roomNumber"
              placeholder="Hostel Room Number"
              value={formData.roomNumber}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
          </div>

          <textarea
            name="requestMessage"
            placeholder="Write your outing request reason here..."
            value={formData.requestMessage}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mt-4"
          ></textarea>

          <select
            name="outingType"
            value={formData.outingType}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-4"
          >
            <option value="Outing">Outing</option>
            <option value="Home Going">Home Going</option>
            <option value="Others">Others</option>
          </select>

          <input
            type="text"
            name="photoURL"
            placeholder="Paste Photo URL"
            value={formData.photoURL}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mt-4"
          />

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded mt-6">
            Submit Profile
          </button>
        </form>
      </main>
    </div>
  );
}

export default ProfileForm;
