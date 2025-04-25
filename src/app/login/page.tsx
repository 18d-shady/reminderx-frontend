"use client"; // This page is a client-side page
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth"; // Import the login function from auth.ts
import { getCookie } from "cookies-next";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie('reminderx_access');
    if (token) {
      router.replace("/dashboard"); // Redirect to the dashboard if already logged in
    }
  }, [router]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call the login function from auth.ts
      const data = await login(email, password); // Pass email and password to the login function

      // Check if login was successful
      if (data) {
        router.push("/dashboard"); // Redirect to the dashboard after a successful login
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      // If there's an error during login, handle it here
      setError("An error occurred while logging in");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full sm:w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Log In
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">Don't have an account? </span>
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
