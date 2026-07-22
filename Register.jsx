import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, User as UserIcon, LogIn, ShieldCheck } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'patient' });
    const { register } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await register(formData);
            toast.success('Registration successful!');
            navigate(`/${user.role}-dashboard`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <PageTransition className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg px-4 pt-28 pb-12 relative overflow-hidden">
            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary-400/20 rounded-full filter blur-3xl"></div>
            <div className="max-w-4xl w-full flex bg-white dark:bg-dark-card rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-slate-100 dark:border-dark-border">
                <div className="w-full lg:w-1/2 p-8 sm:p-10 border-r border-slate-100 dark:border-dark-border">
                    <div className="mb-8">
                        <Link to="/" className="inline-flex lg:hidden items-center gap-2 mb-8">
                            <Activity className="w-6 h-6 text-primary-600" />
                            <span className="font-bold text-xl text-slate-900 dark:text-white">HealthSphere</span>
                        </Link>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Create Account</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Join HealthSphere today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input type="text" required onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all" placeholder="John Doe" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input type="email" required onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all" placeholder="you@example.com" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input type="password" required onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all" placeholder="••••••••" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">I am a</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <select onChange={e => setFormData({...formData, role: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white appearance-none cursor-pointer transition-all">
                                    <option value="patient">Patient</option>
                                    <option value="doctor">Doctor</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="w-full flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary-500/30 mt-2">
                            Create Account
                        </button>
                    </form>
                    
                    <p className="text-center mt-6 text-slate-600 dark:text-slate-400">
                        Already have an account? <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
                
                <div className="hidden lg:flex w-1/2 bg-slate-50 dark:bg-slate-800 items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-primary-600/10 dark:from-secondary/20 dark:to-primary-900/40"></div>
                    <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="relative z-10 glass-card p-8 text-center max-w-sm border-t-4 border-t-primary-500">
                        <div className="w-16 h-16 bg-white dark:bg-dark-card rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                            <Activity className="w-8 h-8 text-primary-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 dark:text-white">Seamless Healthcare</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Join thousands of users who have revolutionized their healthcare experience through instant bookings and tele-health features.</p>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Register;
