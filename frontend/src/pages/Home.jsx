import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-r from-blue-200 to-indigo-300">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Hostel Outing Permission System</h1>
        <p className="text-lg text-gray-700 mb-8">Manage all hostel outing requests easily</p>
        <div className="space-x-4">
          <a href="/login" className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full text-lg">
            Login
          </a>
          <a href="/signup" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full text-lg">
            Sign Up
          </a>
        </div>
      </main>
    </div>
  );
}

export default Home;
