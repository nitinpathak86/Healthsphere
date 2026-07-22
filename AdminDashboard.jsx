import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, CheckCircle, Server, Trash2, ShieldCheck, UserPlus, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';

const AdminDashboard = () => {
    const [tab, setTab] = useState('overview'); // 'overview', 'users'

    return (
        <DashboardLayout 
            title="Admin Control Center"
            activeTab={tab}
            onTabChange={setTab}
            sidebarLinks={[
                { title: 'Platform Management', id: 'overview', icon: Server },
                { title: 'User Logs', id: 'users', icon: Users },
            ]}
        >
            {tab === 'overview' ? <AdminOverview /> : <UserLogs />}
        </DashboardLayout>
    );
};

const AdminOverview = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [statsRes, docsRes, usersRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/doctors'),
                    api.get('/admin/users')
                ]);
                setStats(statsRes.data);
                setDoctors(docsRes.data);
                setUsers(usersRes.data);
            } catch (err) {
                toast.error('Failed to load admin data');
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const approveDoctor = async (id) => {
        try {
            await api.put(`/admin/doctors/${id}/approve`);
            toast.success('Doctor approved!');
            setDoctors(doctors.map(d => d._id === id ? { ...d, isApproved: true } : d));
        } catch (error) {
            toast.error('Approval failed');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            toast.success('User deleted');
            setUsers(users.filter(u => u._id !== id));
            setDoctors(doctors.filter(d => d.userId?._id !== id));
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
    );

    const chartData = [
        { name: 'Patients', count: stats?.patients || 0 },
        { name: 'Doctors', count: stats?.doctors || 0 },
        { name: 'Appointments', count: stats?.appointments || 0 },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Patients', value: stats?.patients || 0, icon: Users, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
                    { label: 'Total Doctors', value: stats?.doctors || 0, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: 'Approved', value: stats?.approvedDoctors || 0, icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Appointments', value: stats?.appointments || 0, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        key={stat.label} className="glass-card p-6 flex items-center gap-4 border border-slate-100 dark:border-dark-border"
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                            <stat.icon className={`w-7 h-7 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6 border border-slate-100 dark:border-dark-border h-[400px]">
                    <h3 className="font-bold text-xl mb-6 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" /> Platform Growth
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-6 border border-slate-100 dark:border-dark-border">
                    <h3 className="font-bold text-xl mb-6 dark:text-white flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-emerald-500" /> Recent User Registrations
                    </h3>
                    <div className="space-y-4">
                        {users.slice(0, 5).map((u, i) => (
                            <div key={u._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-700">
                                        {u.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold dark:text-white">{u.name}</p>
                                        <p className="text-xs text-slate-500">{u.email}</p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-md bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600">
                                    {u.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 border border-slate-100 dark:border-dark-border">
                <h3 className="font-bold text-xl mb-6 dark:text-white">Doctor Approvals</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                <th className="pb-3 px-4">Name</th>
                                <th className="pb-3 px-4">Specialization</th>
                                <th className="pb-3 px-4">Experience</th>
                                <th className="pb-3 px-4">Status</th>
                                <th className="pb-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doc, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
                                    key={doc._id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{doc.userId?.name}</td>
                                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{doc.specialization}</td>
                                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{doc.experience} Yrs</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${doc.isApproved ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-500'}`}>
                                            {doc.isApproved ? 'Approved' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right flex justify-end gap-2">
                                        {!doc.isApproved && (
                                            <button 
                                                onClick={() => approveDoctor(doc._id)}
                                                className="inline-flex items-center gap-1 bg-primary-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors"
                                            >
                                                Approve <CheckCircle className="w-3.5 h-3.5"/>
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDeleteUser(doc.userId?._id)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                            title="Delete Account"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {doctors.length === 0 && <p className="text-center py-6 text-slate-500">No doctors pending approval.</p>}
                </div>
            </div>
        </div>
    );
};

const UserLogs = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } catch (err) {
                toast.error('Failed to load users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete user? This cannot be undone.')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            toast.success('User deleted');
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    if (loading) return <div>Loading logs...</div>;

    return (
        <div className="glass-card p-6 border border-slate-100 dark:border-dark-border">
            <h3 className="font-bold text-xl mb-6 dark:text-white">Detailed User Logs</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 text-xs uppercase font-black">
                            <th className="py-4 px-4">Name</th>
                            <th className="py-4 px-4">Email</th>
                            <th className="py-4 px-4">Role</th>
                            <th className="py-4 px-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="py-4 px-4 font-bold dark:text-white">{u.name}</td>
                                <td className="py-4 px-4 text-slate-500">{u.email}</td>
                                <td className="py-4 px-4">
                                    <span className="px-2 py-0.5 text-[10px] uppercase font-black bg-slate-100 dark:bg-slate-700 rounded">{u.role}</span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="w-4 h-4 ml-auto" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
