"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EyeOff } from 'lucide-react';
import { Eye } from 'lucide-react';


export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Add this to your dashboard or any protected page
  useEffect(() => {
    const checkTokenExpiry = () => {
      const cookies = document.cookie.split(';');
      const accessToken = cookies.find(c => c.includes('access_token'))?.split('=')[1];

      if (accessToken) {
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const expiry = new Date(payload.exp * 1000);
          const now = new Date();
          const timeLeft = Math.round((expiry.getTime() - now.getTime()) / 1000 / 60); // minutes left

          console.log('Access token expires in:', timeLeft, 'minutes');
          console.log('Expires at:', expiry.toLocaleString());
        } catch (error) {
          console.error('Error parsing token:', error);
        }
      }
    };

    checkTokenExpiry();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",

    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Login successful!");
      router.push("/dashboard"); // redirect to dashboard or home
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter Your Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-700 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (<Eye /> ) : ( <EyeOff /> )}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          Login
        </button>
      </form>

      {message && (
        <p className={`mt-4 p-3 rounded-lg text-center ${message.includes("success")
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700"
          }`}>
          {message}
        </p>
      )}
    </div>
  );
}
