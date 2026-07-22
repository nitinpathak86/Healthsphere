import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Activity, ChevronRight, Star, Shield, Clock } from 'lucide-react';
import api from '../utils/axiosInstance';
import PageTransition from '../components/PageTransition';

const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const Home = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await api.get('/patient/doctors');
                setDoctors(res.data.slice(0, 3)); 
            } catch (error) {
                console.error("Could not fetch doctors");
            }
        };
        fetchDoctors();
    }, []);

    const stats = [
        { label: "Active Patients", value: "50k+", icon: Users },
        { label: "Expert Doctors", value: "1000+", icon: Activity },
        { label: "Years Experience", value: "15+", icon: Star },
    ];

    return (
        <PageTransition className="bg-slate-50 dark:bg-dark-bg min-h-screen overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-40 dark:opacity-20">
                    <div className="absolute top-20 left-0 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-40 right-20 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: "2s" }}></div>
                    <div className="absolute -bottom-8 left-40 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: "4s" }}></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left"
                    >
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
                            Your Health, <br/>
                            <span className="text-gradient">Simplified.</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0">
                            Experience premium healthcare access. Connect with top specialists, book appointments instantly, and manage your health records seamlessly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/register" className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-1">
                                Book Appointment <ChevronRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link to="/doctors" className="inline-flex items-center justify-center glass dark:bg-slate-800/50 border-primary-200 dark:border-slate-700 text-slate-700 dark:text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                Explore Doctors
                            </Link>
                        </div>
                        
                        {/* Stats Row */}
                        <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-dark-border">
                            {stats.map((stat, i) => (
                                <div key={i}>
                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 mb-1">
                                        <stat.icon className="w-5 h-5 text-primary-500" />
                                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative hidden lg:block"
                    >
                        {/* Premium Hero Image Replacement (Using CSS/Glassmorphism shapes to simulate a dashboard UI) */}
                        <div className="relative w-full h-[600px] glass-card p-6 flex flex-col gap-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="w-24 h-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex-shrink-0 animate-pulse"></div>
                                <div className="flex flex-col gap-2 w-full pt-2">
                                    <div className="w-1/2 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                    <div className="w-1/3 h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="h-32 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-pulse"></div>
                                <div className="h-32 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            
                            {/* Floating Element */}
                            <motion.div 
                                animate={{ y: [0, -20, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute -left-12 top-32 glass-card p-4 flex items-center gap-4 border-l-4 border-l-secondary shadow-lg shadow-secondary/10"
                            >
                                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-secondary" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Verified</p>
                                    <p className="font-bold text-sm text-slate-900 dark:text-white">Top Rated Doctors</p>
                                </div>
                            </motion.div>
                            
                            {/* Floating Element 2 */}
                            <motion.div 
                                animate={{ y: [0, 20, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                className="absolute -right-8 bottom-32 glass-card p-4 flex items-center gap-4 border-l-4 border-l-accent shadow-lg shadow-accent/10"
                            >
                                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Available</p>
                                    <p className="font-bold text-sm text-slate-900 dark:text-white">24/7 Booking</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-white dark:bg-dark-card border-y border-slate-100 dark:border-dark-border relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeUp>
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">Simple Process</h2>
                            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">How HealthSphere Works</h3>
                        </div>
                    </FadeUp>
                    
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 dark:from-slate-700 dark:via-primary-600 dark:to-slate-700 -translate-y-1/2 z-0"></div>
                        
                        {[
                            { icon: Activity, title: 'Find your doctor', desc: 'Filter by specialty, fee, or rating to find your perfect match.' },
                            { icon: Calendar, title: 'Choose time', desc: 'Select an available time slot that fits your schedule.' },
                            { icon: Shield, title: 'Book instantly', desc: 'Confirm your appointment and manage records securely.' }
                        ].map((step, idx) => (
                            <FadeUp key={idx} delay={idx * 0.2}>
                                <div className="relative z-10 flex flex-col items-center bg-white dark:bg-dark-bg p-8 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm hover:shadow-xl transition-shadow group">
                                    <div className="w-20 h-20 rounded-2xl bg-primary-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                        <step.icon className="w-8 h-8 text-primary-600 group-hover:text-white" />
                                    </div>
                                    <h4 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{step.title}</h4>
                                    <p className="text-center text-slate-500 dark:text-slate-400">{step.desc}</p>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Top Doctors Preview */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeUp>
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-sm font-bold tracking-widest text-secondary uppercase mb-3">Premium Care</h2>
                                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Our Top Specialists</h3>
                            </div>
                            <Link to="/doctors" className="hidden sm:flex items-center text-primary-600 font-bold hover:text-primary-700">
                                View all Doctors <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </FadeUp>
                    
                    {doctors.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {doctors.map((doc, idx) => (
                                <FadeUp key={doc._id} delay={idx * 0.1}>
                                    <motion.div 
                                        whileHover={{ y: -8 }}
                                        className="bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all"
                                    >
                                        <div className="h-32 bg-gradient-to-r from-primary-100 to-primary-50 dark:from-slate-800 dark:to-slate-700 relative">
                                            <div className="absolute -bottom-10 left-6">
                                                <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-full border-4 border-white dark:border-dark-card flex items-center justify-center font-bold text-3xl text-primary-600 shadow-md">
                                                    {doc.userId?.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="absolute top-4 right-4 bg-white/80 dark:bg-dark-bg/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-yellow-500 flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-current" /> 4.9
                                            </div>
                                        </div>
                                        <div className="p-6 pt-14">
                                            <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{doc.userId?.name}</h3>
                                            <p className="text-secondary font-medium mb-4 flex items-center gap-2">
                                                <Activity className="w-4 h-4"/> {doc.specialization}
                                            </p>
                                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                                                <div>
                                                    <p className="text-xs text-slate-400">Experience</p>
                                                    <p className="font-bold text-slate-900 dark:text-white">{doc.experience} Years</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400">Consultation Fee</p>
                                                    <p className="font-bold text-slate-900 dark:text-white">${doc.fees}</p>
                                                </div>
                                            </div>
                                            <Link to="/login" className="block w-full text-center bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white transition-colors py-3 rounded-xl font-bold">
                                                Book Appointment
                                            </Link>
                                        </div>
                                    </motion.div>
                                </FadeUp>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border">
                            <p className="text-slate-500 dark:text-slate-400 mb-4">You need an account to view and book premium specialists.</p>
                            <Link to="/login" className="inline-block bg-primary-600 hover:bg-primary-700 transition-colors text-white px-8 py-4 rounded-xl font-bold">Log In to View Doctors</Link>
                        </div>
                    )}
                </div>
            </section>
        </PageTransition>
    );
};

export default Home;
