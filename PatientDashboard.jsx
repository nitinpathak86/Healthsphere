import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Activity, Calendar, FileText, Ban, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';

const PatientDashboard = () => {
    return (
        <DashboardLayout 
            title="My Health Dashboard"
            sidebarLinks={[
                { title: 'Overview', path: '/patient-dashboard', icon: Activity },
                { title: 'Find Doctors', path: '/doctors', icon: Calendar },
            ]}
        >
            <PatientOverview />
        </DashboardLayout>
    );
};

const PatientOverview = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await api.get('/patient/appointments');
                setAppointments(res.data);
            } catch (error) {
                toast.error('Failed to load appointments');
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const cancelAppointment = async (id) => {
        try {
            await api.put(`/patient/appointments/${id}/cancel`);
            toast.success('Appointment cancelled');
            setAppointments(appointments.map(app => app._id === id ? { ...app, status: 'cancelled' } : app));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cancellation failed');
        }
    };

    // Chart Data
    const statusCounts = appointments.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
    }, {});
    
    const pieData = Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] })).filter(d => d.value > 0);
    const COLORS = ['#3b82f6', '#10B981', '#f59e0b', '#ef4444']; 

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-l-4 border-primary-500">
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-1 capitalize">Total Requests</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">{appointments.length}</h3>
                </div>
                <div className="glass-card p-6 border-l-4 border-emerald-500">
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-1 capitalize">Accepted</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">{appointments.filter(a => a.status === 'accepted').length}</h3>
                </div>
                <div className="glass-card p-6 border-l-4 border-yellow-500">
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-1 capitalize">Pending</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">{appointments.filter(a => a.status === 'pending').length}</h3>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="glass-card p-6 lg:col-span-1">
                    <h3 className="font-bold text-lg mb-6 text-slate-900 dark:text-white">Appointment Status</h3>
                    {pieData.length > 0 ? (
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={pieData} 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={60} 
                                    outerRadius={80} 
                                    paddingAngle={5} 
                                    dataKey="value"
                                    isAnimationActive={true}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    ) : (
                        <div className="h-[250px] flex items-center justify-center text-slate-500">No data available</div>
                    )}
                </div>

                <div className="glass-card p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Appointments</h3>
                    </div>
                    {loading ? (
                        <div className="space-y-4">
                            {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>)}
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="text-center py-10">
                            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-500 dark:text-slate-400">You have no appointments yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {appointments.slice().reverse().map((app, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: Math.min(idx * 0.1, 1) }}
                                    key={app._id} 
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-all gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white dark:bg-dark-card flex items-center justify-center font-bold text-primary-600 text-lg shadow-sm">
                                            {app.doctorId?.userId?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 dark:text-white">Dr. {app.doctorId?.userId?.name}</p>
                                            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold mt-1">
                                                <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded"><Calendar className="w-3 h-3"/> {app.date}</span>
                                                <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded"><Activity className="w-3 h-3"/> {app.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            app.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-500' :
                                            app.status === 'accepted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                                            app.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                        }`}>
                                            {app.status}
                                        </span>
                                        {['pending', 'confirmed'].includes(app.status) && (
                                            <button 
                                                onClick={() => cancelAppointment(app._id)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Cancel Appointment"
                                            >
                                                <Ban className="w-5 h-5"/>
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
