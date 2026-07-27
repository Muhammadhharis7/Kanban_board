// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../api/axios";

// function Register() {
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         userName: "",
//         fullName: "",
//         email: "",
//         password: "",
//     });

//     const [avatar, setAvatar] = useState(null);
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleFileChange = (e) => {
//         setAvatar(e.target.files[0]);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");

//         if (!avatar) {
//             setError("Please select an avatar image");
//             return;
//         }

//         // multipart/form-data needs FormData, not a plain JS object
//         const data = new FormData();
//         data.append("userName", formData.userName);
//         data.append("fullName", formData.fullName);
//         data.append("email", formData.email);
//         data.append("password", formData.password);
//         data.append("avatar", avatar); // must match the field name your Multer route expects

//         try {
//             setLoading(true);
//             const response = await api.post("/users/register", data, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });

//             console.log("Registered:", response.data);
//             navigate("/login");
//         } catch (err) {
//             const message =
//                 err.response?.data?.message || "Something went wrong. Please try again.";
//             setError(message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//             <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
//                 <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
//                     Create your account
//                 </h1>

//                 {error && (
//                     <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
//                         {error}
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Username
//                         </label>
//                         <input
//                             type="text"
//                             name="userName"
//                             value={formData.userName}
//                             onChange={handleChange}
//                             required
//                             className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Full name
//                         </label>
//                         <input
//                             type="text"
//                             name="fullName"
//                             value={formData.fullName}
//                             onChange={handleChange}
//                             required
//                             className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                             className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Password
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 name="password"
//                                 value={formData.password}
//                                 autoComplete="new-password"
//                                 onChange={handleChange}
//                                 required
//                                 className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword((prev) => !prev)}
//                                 className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
//                                 aria-label={showPassword ? "Hide password" : "Show password"}
//                             >
//                                 {showPassword ? (
//                                     // eye-off icon
//                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//                                         <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
//                                         <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
//                                         <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
//                                         <line x1="2" y1="2" x2="22" y2="22" />
//                                     </svg>
//                                 ) : (
//                                     // eye icon
//                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//                                         <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
//                                         <circle cx="12" cy="12" r="3" />
//                                     </svg>
//                                 )}
//                             </button>
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Avatar
//                         </label>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleFileChange}
//                             required
//                             className="w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
//                     >
//                         {loading ? "Creating account..." : "Register"}
//                     </button>
//                 </form>

//                 <p className="mt-4 text-center text-sm text-gray-600">
//                     Already have an account?{" "}
//                     <Link to="/login" className="text-blue-600 hover:underline">
//                         Log in
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// }

// export default Register;













import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
 
function Register() {
    const navigate = useNavigate();
 
    const [formData, setFormData] = useState({
        userName: "",
        fullName: "",
        email: "",
        password: "",
    });
 
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
 
    const handleFileChange = (e) => {
        setAvatar(e.target.files[0]);
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
 
        if (!avatar) {
            setError("Please select an avatar image");
            return;
        }
 
        // multipart/form-data needs FormData, not a plain JS object
        const data = new FormData();
        data.append("userName", formData.userName);
        data.append("fullName", formData.fullName);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("avatar", avatar); // must match the field name your Multer route expects
 
        try {
            setLoading(true);
            const response = await api.post("/users/register", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
 
            console.log("Registered:", response.data);
            navigate("/login");
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
                    onClick={() => navigate("/login")}
                    className="mb-4 text-sm text-gray-500 hover:text-gray-700"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                    Create your account
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
                            value={formData.userName}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
 
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
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
                            value={formData.email}
                            onChange={handleChange}
                            required
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
                                    // eye-off icon
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                        <line x1="2" y1="2" x2="22" y2="22" />
                                    </svg>
                                ) : (
                                    // eye icon
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
 
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Avatar
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            className="w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
 
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>
 
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
 
export default Register;