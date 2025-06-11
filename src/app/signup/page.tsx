"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";
import { getCookie } from "cookies-next";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/Loader";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie('reminderx_access');
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate password match
    if (password !== repassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const data = await register(username, email, password);
      if (data) {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.details) {
        setError(error.response.data.details);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen h-screen flex justify-center bg-black font-mono relative overflow-hidden">
      <div className="absolute bgg-main rounded-full bottom-0 right-0 opacity-50 translate-x-28 
      translate-y-[550px] w-[1000px] h-[1000px]"></div>
      <div className="p-8 w-full h-full md:w-5/12 flex flex-col justify-between">
        <h1 className="flex items-center text-white text-xl">
          REMINDER 
          <span className="fff-main text-4xl ">X</span>
        </h1>

        <div className="text-white px-10">
          <h4 className="text-center text-2xl">Create Account</h4>

          {error && <div className="text-red-500 text-sm mb-3 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="my-5">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-3 p-4 bg-white rounded-full text-sm text-gray-800"
              placeholder="Enter your preferred Username"
              required
            />

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-3 p-4 bg-white rounded-full text-sm text-gray-800"
              placeholder="Enter your unique email address"
              required
            />

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-3 p-4 bg-white rounded-full text-sm text-gray-800"
              placeholder="Password"
              required
            />

            <input
              type="password"
              id="repassword"
              value={repassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="w-full mt-3 p-4 bg-white rounded-full text-sm text-gray-800"
              placeholder="Confirm Password"
              required
            />

            <button
              type="submit"
              className="w-full bgg-main text-black p-4 rounded-xl hover:bg-blue-600 transition
               duration-200 mt-3 text-sm"
            >
              Create Account
            </button>
          </form>
        </div>

        <div className="text-left mt-4">
          <span className="text-sm text-gray-500">Already have an account? </span>
          <Link href="/login" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      </div>

      <div className="h-full relative hidden md:flex w-7/12 py-7 px-10">
        <div className="rounded-3xl overflow-hidden w-full h-full relative">
          <Image 
            alt="signup"
            src="/images/signup_image.png"
            fill
            style={{ 
              objectFit: 'cover', 
              objectPosition: 'center' 
            }}
          />
        </div>

        <div className="absolute top-0 left-0">
          <svg width="100" height="114" viewBox="0 0 150 184" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M148.797 59.3476C155.467 89.8505 133.668 120.19 101.458 145.8C69.2481 171.572 26.6267 192.941 9.54555 180.218C-7.53556 167.494 0.760976 120.843 15.2392 79.5741C29.7175 38.3054 50.3775 2.58274 78.358 0.135974C106.501 -2.31079 141.965 28.6815 148.797 59.3476Z" fill="#8EB0D6"/>
          </svg>
        </div>

        <div className="absolute bottom-0 right-0">
          <svg width="120" height="155" viewBox="0 0 170 235" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M207.803 104.138C226.533 159.577 225.138 223.59 193.456 246.523C161.972 269.656 100.401 251.907 57.5592 218.405C14.9172 184.903 -8.99422 135.647 3.16076 88.9826C15.3157 42.5182 63.7364 -1.55331 107.175 0.042033C150.615 1.63738 189.271 48.7001 207.803 104.138Z" fill="#8EB0D6"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
