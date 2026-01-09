import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "../Services/AuthService";
import { toast } from "react-toastify";
import OtpInput from 'react-otp-input';
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // States
    const [step, setStep] = useState(1); // 1: OTP, 2: New Password
    const [otp, setOtp] = useState(searchParams.get("token") || "");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const email = searchParams.get("email");

    // Animation Variants
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: -20 }
    };

    const handleNextStep = (e) => {
        if (e) e.preventDefault();
        if (otp.length < 6) return toast.error("Please enter a valid 6-digit OTP");
        setStep(2);
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return toast.error("Passwords mismatch");

        setIsLoading(true);
        try {
            await authService.resetPassword({
                email,
                token: otp,
                newPassword,
                confirmPassword
            });
            toast.success("Password updated successfully!");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid or expired OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900/95 p-4 fixed inset-0 z-50 backdrop-blur-md">
            <AnimatePresence mode="wait">
                {/* STEP 1: OTP MODAL */}
                {step === 1 && (
                    <motion.div
                        key="otp-step"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                                <span className="text-3xl">🛡️</span>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">Verify OTP</h2>
                            <p className="text-gray-500 text-center mb-8 text-sm">
                                Enter the 6-digit code sent to <br /> 
                                <span className="font-bold text-gray-800">{email}</span>
                            </p>

                            <div className="mb-8">
                                <OtpInput
                                    value={otp}
                                    onChange={setOtp}
                                    numInputs={6}
                                    renderInput={(props) => <input {...props} />}
                                    containerStyle="flex justify-between gap-2"
                                    inputStyle={{
                                        width: "3rem",
                                        height: "4rem",
                                        fontSize: "1.5rem",
                                        borderRadius: "12px",
                                        border: "2px solid #e5e7eb",
                                        fontWeight: "bold",
                                        outline: "none",
                                        backgroundColor: "#f9fafb",
                                        color: "#000"
                                    }}
                                    shouldAutoFocus
                                    focusStyle={{
                                        border: "2px solid #dc2626",
                                        backgroundColor: "#fff",
                                        boxShadow: "0 0 0 4px rgba(220, 38, 38, 0.1)"
                                    }}
                                />
                            </div>

                            <button
                                onClick={handleNextStep}
                                className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200"
                            >
                                Continue
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: PASSWORD MODAL */}
                {step === 2 && (
                    <motion.div
                        key="password-step"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100"
                    >
                        <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">New Password</h2>
                        <p className="text-gray-500 text-center mb-8 text-sm">Set a strong password for your account</p>
                        
                        <form onSubmit={handleReset} className="space-y-4">
                            <input
                                type="password"
                                placeholder="New Password"
                                className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none focus:border-red-500 transition-all"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none focus:border-red-500 transition-all"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-[2] bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 transition shadow-lg"
                                >
                                    {isLoading ? "Updating..." : "Reset Password"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ResetPasswordPage;