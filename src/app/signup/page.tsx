"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { register, sendVerificationEmail, resendOtp, verifyOrganization } from "@/lib/auth";
import { getCookie } from "cookies-next";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";


const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState('');
  const [repassword, setRePassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [pendingUser, setPendingUser] = useState<{ username: string; email: string; password: string } | null>(null);
  const router = useRouter();
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(600); // 10 minutes in seconds
  const [resendCooldown, setResendCooldown] = useState(0); // 30s cooldown for resend
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [showOrgModal, setShowOrgModal] = useState(false);
  const [organizationId, setOrganizationId] = useState("");
  const [orgVerified, setOrgVerified] = useState<{ id: string; name: string } | null>(null);
  const [orgError, setOrgError] = useState<string | null>(null);
  const [isVerifyingOrg, setIsVerifyingOrg] = useState(false);


  useEffect(() => {
    const token = getCookie('reminderx_access');
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  // Countdown timer for OTP
  useEffect(() => {
    if (!showOtpModal) return;
    if (otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showOtpModal, otpTimer]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Reset timer when modal opens
  useEffect(() => {
    if (showOtpModal) setOtpTimer(600);
  }, [showOtpModal]);

  // Trap focus in modal
  useEffect(() => {
    if (!showOtpModal) return;
    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
      'input, button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    function handleTab(e: KeyboardEvent) {
      if (!focusable || focusable.length === 0) return;
      if (e.key === "Tab") {
        if (document.activeElement === last && !e.shiftKey) {
          e.preventDefault();
          first?.focus();
        } else if (document.activeElement === first && e.shiftKey) {
          e.preventDefault();
          last?.focus();
        }
      }
    }
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [showOtpModal]);

  const isValidPassword = (password: string) => {
    const minLength = password.length >= 5;
    const hasNumber = /\d/.test(password); // \d matches any digit
    return minLength && hasNumber;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPassword(password)) {
      setPasswordError("Password must be at least 5 characters and contain a number.");
      return;
    }
    setError(null);
    setIsLoading(true);

    if (password !== repassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Send verification email (now also checks username)
      await sendVerificationEmail(email, username);
      setPendingUser({ username, email, password });
      setShowOtpModal(true);
    } catch (error: any) {
      if (error.response?.data?.error) {
        if (error.response.data.error.includes("Username")) {
          setUsernameError(error.response.data.error);
        } else if (error.response.data.error.includes("Email")) {
          setEmailError(error.response.data.error);
        } else {
          setError(error.response.data.error);
        }
      } else {
        setError("Failed to send verification email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpInputChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow single digit
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otpDigits[index] === "") {
        if (index > 0) {
          otpInputsRef.current[index - 1]?.focus();
        }
      } else {
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = "";
        setOtpDigits(newOtpDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("Text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(""));
      setTimeout(() => {
        otpInputsRef.current[5]?.focus();
      }, 0);
    }
    e.preventDefault();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setEmailError(null);
    setUsernameError(null);
    setIsOtpLoading(true);
    if (!pendingUser) return;
    const otp = otpDigits.join("");
    try {
      // Directly register with OTP
      const data = await register(pendingUser.username, pendingUser.email, pendingUser.password, otp, orgVerified?.id);
      setShowOtpModal(false);
      router.push("/dashboard");
    } catch (error: any) {
      // Field-specific error handling
      if (error.response?.data?.details) {
        const details = error.response.data.details;
        if (details.email) setEmailError(details.email[0]);
        if (details.username) setUsernameError(details.username[0]);
        setOtpError("Please fix the errors above.");
      } else if (error.response?.data?.error) {
        setOtpError(error.response.data.error);
      } else if (error.response?.data?.message) {
        setOtpError(error.response.data.message);
      } else {
        setOtpError("Invalid or expired OTP. Please try again.");
      }
    } finally {
      setIsOtpLoading(false);
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError(null);
    if (!pendingUser || resendCooldown > 0) return;
    try {
      await resendOtp(pendingUser.email, pendingUser.username);
      setOtpError("A new OTP has been sent to your email.");
      setOtpTimer(600); // Reset OTP timer
      setResendCooldown(30); // 30s cooldown
    } catch (error: any) {
      setOtpError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <>
      <Loader isOpen={isLoading} />
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
            <h4 className="text-center text-xl lg:text-2xl">Create Account</h4>

            {orgVerified &&
              <p className="text-white text-lg mt-3 text-center">
                Organization Name: {orgVerified.name}
              </p>
            }

            {error && <div className="text-red-500 text-sm mb-3 text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="my-5">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError(null);
                }}
                className="w-full mt-3 p-4 bg-white rounded-full text-sm text-gray-800"
                placeholder="Enter your preferred Username"
                required
              />
              {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}

              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null);
                }}
                className="w-full mt-3 p-4 bg-white rounded-full text-sm text-gray-800"
                placeholder="Enter your unique email address"
                required
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}

              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);

                  if (!isValidPassword(value)) {
                    setPasswordError("Password must be at least 5 characters and contain a number.");
                  } else {
                    setPasswordError('');
                  }
                }}
                className={`w-full mt-3 p-4 rounded-full text-xs ${
                  passwordError ? 'border border-red-500' : 'bg-white text-gray-800'
                }`}
                placeholder="Password"
                required
              />

              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}

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
                className="w-full bgg-main bgg-hover text-black p-4 rounded-xl hover:bg-blue-600 transition
                 duration-200 mt-3 text-sm"
              >
                Create Account
              </button>
            </form>

            {!orgVerified && (
              <button
                className="px-3 py-2 border bdd-main text-white rounded-full hover:bg-gray-700 text-sm mx-auto block"
                onClick={() => setShowOrgModal(true)}
              >
                Sign up with an Organization
              </button>
            )}

          </div>
          

          <div className="text-left mt-4">
            <span className="text-xs text-gray-500">Have an account? </span>
            <Link href="/login" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </div>

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
              alt="signup"
              src="/images/signup_image.png"
              fill
              style={{ 
                objectFit: 'cover', 
                objectPosition: 'left' 
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
          isOpen={showOrgModal}
          onClose={() => setShowOrgModal(false)}
          title="Join an Organization"
          size="sm"
          footer={null}
        >
          <div>
            <input
              type="text"
              value={organizationId}
              onChange={(e) => {
                setOrganizationId(e.target.value);
                setOrgError(null);
              }}
              placeholder="Enter Organization ID"
              className="w-full p-3 border rounded mb-3"
            />
            {orgError && <p className="text-red-500 text-xs mb-2">{orgError}</p>}

            {orgVerified ? (
              <p className="text-green-600 text-sm mb-3">
                ✅ Verified organization: {orgVerified.name}
              </p>
            ) : null}

            <button
              className="w-full bgg-main text-black p-3 rounded-xl text-sm bgg-hover"
              disabled={isVerifyingOrg || !organizationId}
              onClick={async () => {
                setIsVerifyingOrg(true);
                try {
                  const res = await verifyOrganization(organizationId);
                  setOrgVerified({ id: res.organizational_id, name: res.name });
                  setOrgError(null);
                } catch (err: any) {
                  setOrgVerified(null);
                  setOrgError("Organization not found");
                } finally {
                  setIsVerifyingOrg(false);
                }
              }}
            >
              {isVerifyingOrg ? "Verifying..." : "Verify Organization"}
            </button>

            {orgVerified && (
              <button
                className="w-full mt-3 bg-white fff-main border bdd-main text-sm p-3 rounded-xl hover:bg-gray-200"
                onClick={() => {
                  setShowOrgModal(false);
                  // proceed with registration form
                }}
              >
                Continue to Registration
              </button>
            )}
          </div>
        </Modal>


        <Modal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          title="Enter OTP"
          size="sm"
          footer={null}
        >
          <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="otp-modal-title">
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="flex justify-center gap-2 mb-2 text-gray-800 dark:text-gray-500">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => { otpInputsRef.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    aria-label={`OTP digit ${idx + 1}`}
                    onChange={e => handleOtpInputChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    onPaste={idx === 0 ? handleOtpPaste : undefined}
                    className="w-10 h-12 text-center text-2xl border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>
              <div className="text-center text-xs text-gray-500 mb-2" aria-live="polite">
                {otpTimer > 0 ? (
                  <>OTP expires in {Math.floor(otpTimer / 60).toString().padStart(2, '0')}:{(otpTimer % 60).toString().padStart(2, '0')}</>
                ) : (
                  <span className="text-red-500">OTP expired. Please resend.</span>
                )}
              </div>
              {otpError && <div className="text-red-500 text-xs text-center">{otpError}</div>}
              <button
                type="submit"
                className="w-full bgg-main bgg-hover text-black p-3 rounded-xl hover:bg-blue-600 transition duration-200 text-sm"
                disabled={isOtpLoading || isVerifyingOtp || otpDigits.some(d => d === "") || otpTimer === 0}
                aria-disabled={isOtpLoading || isVerifyingOtp || otpDigits.some(d => d === "") || otpTimer === 0}
              >
                {isOtpLoading || isVerifyingOtp ? "Verifying..." : "Verify & Create Account"}
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                className="w-full mt-2 text-blue-500 hover:underline text-xs"
                disabled={isOtpLoading || resendCooldown > 0}
                aria-disabled={isOtpLoading || resendCooldown > 0}
                aria-label="Resend OTP"
              >
                {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : "Resend OTP"}
              </button>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default SignupPage;
