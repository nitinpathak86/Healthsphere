import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Users, Check, X, Calendar as CalendarIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';

const DoctorDashboard = () => {
    const [view, setView] = useState('overview'); // 'overview', 'profile'

    return (
        <DashboardLayout 
            title="Doctor Workspace"
            activeTab={view}
            onTabChange={setView}
            sidebarLinks={[
                { title: 'Appointments', id: 'overview', icon: CalendarIcon },
                { title: 'Profile Settings', id: 'profile', icon: Users },
            ]}
        >
            {view === 'overview' ? <DoctorOverview setView={setView} /> : <DoctorProfile setView={setView} />}
        </DashboardLayout>
    );
};


const DoctorOverview = ({ setView }) => {
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({ today: 0, pending: 0, total: 0 });
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const [appsRes, profileRes] = await Promise.all([
                    api.get('/doctor/appointments'),
                    api.get('/doctor/profile')
                ]);
                setAppointments(appsRes.data);
                setProfile(profileRes.data);
                
                const todayStr = new Date().toISOString().split('T')[0];
                setStats({
                    today: appsRes.data.filter(a => a.date === todayStr && a.status === 'accepted').length,
                    pending: appsRes.data.filter(a => a.status === 'pending').length,
                    total: appsRes.data.filter(a => a.status === 'completed').length
                });
            } catch (err) {
                toast.error('Failed to load appointments');
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const handleAction = async (id, status) => {
        try {
            await api.put(`/doctor/appointments/${id}/manage`, { status });
            toast.success(`Appointment ${status} successfully`);
            setAppointments(appointments.map(a => a._id === id ? { ...a, status } : a));
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${status}`);
        }
    };

    const isProfileIncomplete = profile && (!profile.specialization || profile.specialization === 'General Physician' || profile.fees === 0);

    return (
        <div className="space-y-8">
            {isProfileIncomplete && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-700/50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 dark:text-white">Complete Your Professional Profile</h4>
                            <p className="text-sm text-slate-500">Add your specialization and consultation fees so patients can book you.</p>
                        </div>
                    </div>
                    <button onClick={() => setView('profile')} className="px-6 py-3 bg-yellow-600 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-yellow-700 transition-all">
                        Update Settings
                    </button>
                </motion.div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-l-4 border-primary-500">
                    <p className="text-slate-500 font-medium mb-1">Today's Confirmed</p>
                    <h3 className="text-3xl font-bold dark:text-white">{stats.today}</h3>
                </div>
                <div className="glass-card p-6 border-l-4 border-yellow-500">
                    <p className="text-slate-500 font-medium mb-1">Pending Requests</p>
                    <h3 className="text-3xl font-bold dark:text-white">{stats.pending}</h3>
                </div>
                <div className="glass-card p-6 border-l-4 border-accent">
                    <p className="text-slate-500 font-medium mb-1">Total Patients Seen</p>
                    <h3 className="text-3xl font-bold dark:text-white">{stats.total}</h3>
                </div>
            </div>

            <div className="glass-card p-6 border border-slate-100 dark:border-dark-border">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg dark:text-white">Manage Appointments</h3>
                    <button onClick={() => setView('profile')} className="text-primary-500 text-sm font-bold hover:underline">Edit Profile & Slots</button>
                </div>
                
                {loading ? (
                    <div className="space-y-4">
                        {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>)}
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-10">
                        <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500">No appointments to manage.</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {appointments.map((app, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                                key={app._id} 
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm"
                            >
                                <div>
                                    <p className="font-black text-lg text-slate-900 dark:text-white">{app.patientId?.name}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                        <span className="flex items-center gap-1 font-bold bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded"><CalendarIcon className="w-3 h-3"/> {app.date}</span>
                                        <span className="flex items-center gap-1 font-bold bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded"><Clock className="w-3 h-3"/> {app.time}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${
                                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-500' :
                                        app.status === 'accepted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                                        app.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                                        'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                    }`}>{app.status}</span>
                                    
                                    {app.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleAction(app._id, 'accepted')} className="p-2 bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400 hover:bg-primary-600 hover:text-white rounded-lg transition-colors border border-primary-200 dark:border-primary-800">
                                                <Check className="w-5 h-5"/>
                                            </button>
                                            <button onClick={() => handleAction(app._id, 'rejected')} className="p-2 bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors border border-red-200 dark:border-red-800">
                                                <X className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    )}
                                    {app.status === 'accepted' && (
                                        <button onClick={() => handleAction(app._id, 'completed')} className="px-4 py-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white font-black uppercase text-xs rounded-lg transition-colors tracking-widest">
                                            Complete Visit
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const DoctorProfile = ({ setView }) => {
    const [profile, setProfile] = useState({ specialization: '', experience: '', fees: '', availableSlots: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/doctor/profile');
                setProfile(res.data);
            } catch (err) {
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/doctor/profile', profile);
            toast.success('Profile updated successfully!');
            setView('overview');
        } catch (err) {
            toast.error('Update failed');
        }
    };

    if (loading) return <div>Loading Profile...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-12">
            <div className="flex items-center gap-4">
                <button onClick={() => setView('overview')} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 transition-colors">
                    <X className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-black dark:text-white">Profile Settings</h3>
            </div>

            <form onSubmit={handleSubmit} className="glass-card p-8 border border-slate-100 dark:border-dark-border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Specialization</label>
                        <input 
                            type="text" value={profile.specialization}
                            onChange={(e) => setProfile({...profile, specialization: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                            placeholder="e.g. Cardiologist"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Experience (Yrs)</label>
                        <input 
                            type="number" value={profile.experience}
                            onChange={(e) => setProfile({...profile, experience: e.target.value})}
                                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                            placeholder="e.g. 5"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Fees ($)</label>
                        <input 
                            type="number" value={profile.fees}
                            onChange={(e) => setProfile({...profile, fees: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                            placeholder="e.g. 100"
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button type="submit" className="w-full py-4 bg-primary-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-primary-700 shadow-xl shadow-primary-500/20 transition-all transform hover:-translate-y-1">
                        Save Changes
                    </button>
                    {!profile.isApproved && (
                        <p className="text-center mt-4 text-xs font-bold text-yellow-600 flex items-center justify-center gap-1">
                            <Activity className="w-3 h-3" /> Account pending admin approval
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default DoctorDashboard;
