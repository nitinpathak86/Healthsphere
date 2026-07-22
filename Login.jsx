import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, LogIn } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            toast.success('Welcome back!');
            navigate(`/${user.role}-dashboard`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <PageTransition className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg px-4 py-20 relative overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-400/20 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl"></div>

            <div className="max-w-4xl w-full flex bg-white dark:bg-dark-card rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-slate-100 dark:border-dark-border mt-10">
                <div className="w-full lg:w-1/2 p-8 sm:p-12 border-r border-slate-100 dark:border-dark-border">
                    <div className="mb-10">
                        <Link to="/" className="inline-flex items-center gap-2 mb-8">
                            <Activity className="w-6 h-6 text-primary-600" />
                            <span className="font-bold text-xl text-slate-900 dark:text-white">HealthSphere</span>
                        </Link>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Sign In</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Access your healthcare dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="email" required 
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                                    placeholder="you@example.com"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="password" required 
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                                    placeholder="••••••••"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary-500/30">
                            Sign In <LogIn className="w-5 h-5" />
                        </button>
                    </form>
                    
                    <p className="text-center mt-8 text-slate-600 dark:text-slate-400">
                        Don't have an account? <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">Register</Link>
                    </p>
                </div>
                
                <div className="hidden lg:flex w-1/2 bg-slate-50 dark:bg-slate-800 items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-secondary/10 dark:from-primary-900/40 dark:to-secondary/20"></div>
                    <motion.div 
                        animate={{ y: [0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="relative z-10 glass-card p-8 text-center max-w-sm border-t-4 border-t-secondary"
                    >
                        <div className="w-16 h-16 bg-white dark:bg-dark-card rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                            <Activity className="w-8 h-8 text-secondary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 dark:text-white">Secure Access</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Your medical records and appointment details are securely encrypted and accessible only by you and your authorized healthcare providers.</p>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Login;
