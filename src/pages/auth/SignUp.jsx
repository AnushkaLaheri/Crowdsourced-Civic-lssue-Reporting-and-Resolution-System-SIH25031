"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon, CheckCircleIcon, MapPinIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import OTPVerification from "../../components/OTPVerification";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "citizen",
    lat: null,
    lng: null,
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uid, setUid] = useState("");

  // Detect user location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const address = await reverseGeocodeOSM(latitude, longitude);
          setFormData((prev) => ({ ...prev, lat: latitude, lng: longitude, address }));
          setError("");
        } catch (err) {
          console.error("Location detection error:", err);
          setError("Failed to detect location");
        }
      },
      (err) => setError("Failed to detect location: " + err.message)
    );
  };

  // Reverse geocode to get address
  const reverseGeocodeOSM = async (lat, lon) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
      const resp = await axios.get(url); // Removed User-Agent header
      return resp.data.display_name || "";
    } catch (err) {
      console.error("Reverse geocode error:", err);
      return "";
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.lat || !formData.lng) {
      setError("Please detect your location first");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
  const resp = await axios.post(`${BACKEND_URL}/signup`, { ...formData });
  if (resp.data.uid) {
    setUid(resp.data.uid);
    setStep(2); // move to OTP
  }
} catch (err) {
  setError(err.response?.data?.error || err.message || "Signup failed");
}


    setLoading(false);
  };

  const handleOTPVerification = async (otp) => {
    setLoading(true);
    try {
      const resp = await axios.post(`${BACKEND_URL}/verify-otp`, { uid, otp });
      if (resp.data.message === "Verified") {
        setStep(3);
        setTimeout(() => navigate(`/${formData.role}`), 2000);
      } else {
        setError("OTP verification failed");
        setStep(1);
      }
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed");
      setStep(1);
    }
    setLoading(false);
  };

  if (step === 2)
    return (
      <OTPVerification
        email={formData.email} 
        uid={uid}
        onVerify={handleOTPVerification}
        onBack={() => setStep(1)}
        loading={loading}
      />
    );

  if (step === 3)
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 grid-pattern flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Account Created!</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">Welcome to the civic platform. Redirecting to your dashboard...</p>
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 grid-pattern flex items-center justify-center px-4">
      <div className="max-w-lg w-full space-y-8">
        <Link to="/" className="inline-flex items-center text-neutral-600 dark:text-neutral-400 hover:text-blue-600 transition-colors">
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Create Account</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Join the civic community</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" type="text" required placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />
            <input name="email" type="email" required placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />
            <input name="phone" type="tel" required placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />

            <div className="relative">
              <input name="password" type={showPassword ? "text" : "password"} required placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 pr-12 border rounded-xl" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2">{showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}</button>
            </div>

            <div className="relative">
              <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 pr-12 border rounded-xl" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2">{showConfirmPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}</button>
            </div>

            <div className="flex items-center space-x-2">
              <button type="button" onClick={handleDetectLocation} className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                <MapPinIcon className="w-5 h-5 mr-1"/> Detect Location
              </button>
              {formData.address && <p className="text-sm text-neutral-600 dark:text-neutral-400">{formData.address}</p>}
            </div>

            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl">
              <option value="citizen">Citizen</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>

            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">{loading ? "Creating Account..." : "Create Account"}</button>
          </form>

          <div className="mt-4 text-center">
            <p>Already have an account? <Link to="/signin" className="text-blue-600">Sign in</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
