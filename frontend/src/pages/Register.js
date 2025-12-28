import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ShieldCheck, Loader2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'member' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password.length < 6) {
            return toast.error("Password must be at least 6 characters long");
        }

        setIsLoading(true);
        try {
            const res = await axios.post('https://taskflow-mern-x0zu.onrender.com/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            toast.success("Account created successfully! Welcome aboard.");
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.msg || "Registration failed. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center p-6">
            <div className="max-w-[480px] w-full">
                <div className="bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
                        <p className="text-slate-500 mt-2 font-medium text-sm">Start managing your projects like a pro</p>
                    </div>
                    
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-5">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                            </div>

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input type="email" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="Email Address" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input type="password" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="Password (min. 6 chars)" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <select className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent outline-none appearance-none font-medium text-slate-700" onChange={(e) => setFormData({...formData, role: e.target.value})}>
                                        <option value="member">Team Member</option>
                                        <option value="admin">Project Administrator</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={isLoading}
                            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition duration-300 mt-4 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 font-medium text-sm">
                        Already have an account? <Link to="/" className="text-blue-600 hover:underline font-bold">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;