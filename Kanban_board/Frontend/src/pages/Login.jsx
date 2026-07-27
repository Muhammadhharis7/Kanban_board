import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
 
function Login() {
    const navigate = useNavigate();
 
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
    });
 
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
 
        if (!formData.userName && !formData.email) {
            setError("Please enter your username or email");
            return;
        }
 
        try {
            setLoading(true);
 
            // no FormData needed here — plain JSON is fine, no file involved
            const response = await api.post("/users/login", {
                userName: formData.userName,
                email: formData.email,
                password: formData.password,
            });
 
            console.log("Logged in:", response.data);
            navigate("/dashboard", { replace: true });
            // navigate("/"); // redirect to the board page after successful login
        } catch (err) {
            const message =
                err.response?.data?.message || "Something went wrong. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="mb-4 text-sm text-gray-500 hover:text-gray-700"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                    Log in to your account
                </h1>
 
                {error && (
                    <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}
 
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            name="userName"
                            autoComplete="username"
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="Enter username (or use email below)"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
 
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email (or use username above)"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
 
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                        <line x1="2" y1="2" x2="22" y2="22" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
 
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>
 
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
 
export default Login;
 