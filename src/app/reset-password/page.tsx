'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { confirmPasswordReset } from "@/lib/auth";
import Modal from "@/components/Modal";

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  //const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form behavior

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(token, newPassword);
      setIsModalOpen(true);
      setError('');
    } catch (err: any) {
      console.error(err);
      setError("Reset failed. Token may be invalid or expired, Or your old password is the same as ew one");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push('/login');
  };


  return (
    
    <div className="min-h-screen h-screen flex justify-center bg-black font-mono relative overflow-hidden">
      <div className="absolute bgg-main rounded-full bottom-0 right-0 opacity-50 translate-y-[600px]
       translate-x-[800px] md:translate-x-[550px] md:translate-y-[550px]
       lg:translate-x-28 lg:translate-y-[550px] w-[1000px] h-[1000px]"></div>
      <div className="p-8 w-full h-full md:w-7/12 lg:w-5/12 flex flex-col justify-between">
        <div className="flex items-center text-white text-xl m-4 space-x-2 ">
          <div className="w-9 h-9 overflow-hidden rounded-md relative">
            <Image 
              alt="naikas"
              src="/images/naikas_icon.png"
              fill
              style={{ 
                objectFit: 'cover', 
                objectPosition: 'center' 
              }}
            />
          </div>
          <h1 className="">NAIKAS</h1>
        </div>

        <div className="text-white xl:px-10">
          <h1 className="text-center text-xl lg:text-2xl">Reset Your Password</h1>

          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

          <form onSubmit={handleReset} className="space-y-4 my-5">
            <input
              type="text"
              placeholder="Enter token from email"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full mt-3 p-4 bg-white rounded-full text-sm text-gray-800"
              required
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-3 p-4 bg-white rounded-full text-sm text-gray-800"
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-3 p-4 bg-white rounded-full text-sm text-gray-800"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bgg-main bgg-hover text-black p-4 rounded-xl hover:bg-blue-600 transition
               duration-200 mt-3 text-sm z-44"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            
          </form>
        </div>

        <div className="h-10"></div>

        <div className=" md:hidden absolute -top-9 right-5">
          <svg width="100" height="114" viewBox="0 0 150 184" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M148.797 59.3476C155.467 89.8505 133.668 120.19 101.458 145.8C69.2481 171.572 26.6267 192.941 9.54555 180.218C-7.53556 167.494 0.760976 120.843 15.2392 79.5741C29.7175 38.3054 50.3775 2.58274 78.358 0.135974C106.501 -2.31079 141.965 28.6815 148.797 59.3476Z" fill="#8EB0D6"/>
          </svg>
        </div>

        <div className="md:hidden absolute -bottom-16 -right-6">
          <svg width="120" height="155" viewBox="0 0 170 235" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M207.803 104.138C226.533 159.577 225.138 223.59 193.456 246.523C161.972 269.656 100.401 251.907 57.5592 218.405C14.9172 184.903 -8.99422 135.647 3.16076 88.9826C15.3157 42.5182 63.7364 -1.55331 107.175 0.042033C150.615 1.63738 189.271 48.7001 207.803 104.138Z" fill="#8EB0D6"/>
          </svg>
        </div>
      </div>

      <div className="h-full relative hidden md:flex w-5/12 lg:w-7/12 py-7 px-10">
      
        <div className="rounded-3xl overflow-hidden w-full h-full relative">
          <Image 
            alt="login"
            src="/images/login_image.png"
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Password Reset Successful"
      >
        <p className="text-gray-700">Your password has been reset successfully. You will be redirected to login.</p>
      </Modal>

      
    </div>
  );
}

