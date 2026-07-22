import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import api from '../utils/axiosInstance';
import PageTransition from '../components/PageTransition';
import { CardSkeleton } from '../components/Skeleton';

const DoctorsList = () => {
    const { isAuthenticated } = useAuthStore();
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [specFilter, setSpecFilter] = useState('');
    const [bookingDoc, setBookingDoc] = useState(null);
    const [bookingData, setBookingData] = useState({ date: '', time: '' });
    const [loading, setLoading] = useState(true);
    
    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const res = await api.get('/patient/doctors', {
                params: { search: searchTerm, specialization: specFilter }
            });
            setDoctors(res.data);
        } catch (err) {
            toast.error('Failed to load doctors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(fetchDoctors, 300);
        return () => clearTimeout(timeout);
    }, [searchTerm, specFilter]);

    const handleBook = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return toast.error('Please login to book');
        if (!bookingData.date || !bookingData.time) return toast.error('Select date and time');
        
        try {
            await api.post('/patient/appointments', {
                doctorId: bookingDoc._id,
                date: bookingData.date,
                time: bookingData.time
            });
            toast.success('Appointment requested!');
            setBookingDoc(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        }
    };

    const specializations = [...new Set(doctors.map(d => d.specialization))];

    return (
        <PageTransition className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-dark-bg px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Find Your Specialist</h1>
                    <p className="text-slate-600 dark:text-slate-400">Book appointments with top-rated doctors globally.</p>
                </div>
                
                {/* Filters */}
                <div className="glass-card p-4 md:p-6 mb-10 flex flex-col md:flex-row gap-4 relative z-10 w-full">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search doctors by name..." 
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="md:w-64 relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <select 
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white appearance-none cursor-pointer"
                            value={specFilter}
                            onChange={(e) => setSpecFilter(e.target.value)}
                        >
                            <option value="">All Specialties</option>
                            {specializations.map(spec => (
                                <option key={spec} value={spec}>{spec}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        [1,2,3,4,5,6,7,8].map(i => <CardSkeleton key={i} />)
                    ) : (
                        doctors.map((doc, idx) => (
                            <motion.div 
                                key={doc._id}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 font-bold text-2xl flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                                        {doc.userId?.name.charAt(0)}
                                    </div>
                                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-lg text-sm font-bold">
                                        <Star className="w-3 h-3 fill-current" /> 4.9
                                    </div>
                                </div>
                                <h3 className="font-black text-xl text-slate-900 dark:text-white mb-1">{doc.userId?.name}</h3>
                                <p className="text-primary-500 flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-4">
                                    <Activity className="w-4 h-4"/> {doc.specialization}
                                </p>
                                
                                <div className="space-y-2 mb-6 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 font-bold">Experience</span>
                                        <span className="font-black text-slate-900 dark:text-slate-200">{doc.experience} Years</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 font-bold">Consultation</span>
                                        <span className="font-black text-slate-900 dark:text-slate-200">${doc.fees}</span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => setBookingDoc(doc)}
                                    className="w-full bg-primary-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/10"
                                >
                                    Book Appointment
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>
                
                {doctors.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <Search className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                        <p className="text-lg text-slate-500 dark:text-slate-400">No doctors found matching your criteria.</p>
                    </div>
                )}

                {/* Booking Modal */}
                {bookingDoc && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card w-full max-w-md p-8 border border-white/20">
                            <h3 className="text-2xl font-black mb-2 dark:text-white">Request Visit</h3>
                            <p className="text-slate-500 mb-6 font-bold text-sm">Dr. {bookingDoc.userId?.name} • {bookingDoc.specialization}</p>
                            
                            <form onSubmit={handleBook} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Select Date</label>
                                    <input 
                                        type="date" required 
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3"
                                        onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Select Time</label>
                                    <input 
                                        type="time" required 
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3"
                                        onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setBookingDoc(null)} className="flex-1 py-4 font-black uppercase tracking-widest text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                                    <button type="submit" className="flex-3 py-4 px-8 bg-primary-600 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-primary-500/20">Request Now</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default DoctorsList;
