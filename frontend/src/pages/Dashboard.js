import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Clock, Layout, LogOut, ChevronRight, ChevronLeft, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium' });

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://taskflow-mern-x0zu.onrender.com/api/tasks', {
                headers: { 'x-auth-token': token }
            });
            setTasks(res.data);
        } catch (err) {
            toast.error("Failed to fetch tasks");
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://taskflow-mern-x0zu.onrender.com/api/tasks', newTask, {
                headers: { 'x-auth-token': token }
            });
            setShowModal(false);
            toast.success("Task created!");
            fetchTasks();
        } catch (err) {
            toast.error("Error creating task");
        }
    };

    const updateTaskStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://taskflow-mern-x0zu.onrender.com/api/tasks/${id}`, { status: newStatus }, {
                headers: { 'x-auth-token': token }
            });
            toast.success(`Moved to ${newStatus}`);
            fetchTasks();
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const deleteTask = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold">Delete this task permanently?</p>
                <div className="flex gap-2 justify-end">
                    <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 text-xs bg-slate-100 rounded-md">Cancel</button>
                    <button 
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const deletePromise = axios.delete(`https://taskflow-mern-x0zu.onrender.com/api/tasks/${id}`, {
                                headers: { 'x-auth-token': localStorage.getItem('token') }
                            });
                            toast.promise(deletePromise, {
                                loading: 'Deleting...',
                                success: () => { fetchTasks(); return 'Deleted!'; },
                                error: 'Error!',
                            });
                        }}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded-md"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), { duration: 4000 });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row">
            {/* --- SIDEBAR (Desktop Only) --- */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-6 flex items-center gap-3 border-b border-slate-50">
                    <div className="bg-blue-600 p-2 rounded-lg text-white"><Layout size={20} /></div>
                    <span className="text-xl font-bold text-slate-800">TaskFlow</span>
                </div>
                <nav className="flex-1 p-4 mt-4">
                    <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold">
                        <Layout size={18} /> Dashboard
                    </div>
                </nav>
                <div className="p-4 border-t border-slate-50">
                    <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-hidden">
                <header className="flex items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Workspace</h1>
                        <p className="text-slate-500 text-sm hidden md:block">Track your team progress</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white p-3 md:px-6 md:py-3 rounded-xl md:rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                            <Plus size={20} /> <span className="hidden md:inline">Create Task</span>
                        </button>
                        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }} className="lg:hidden p-3 text-slate-500 bg-white border rounded-xl">
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Task Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {['To-Do', 'In-Progress', 'Completed'].map(status => (
                        <div key={status} className="flex flex-col">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-bold text-slate-700 uppercase tracking-wider text-xs">{status}</h2>
                                    <span className="bg-slate-200 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                                        {tasks.filter(t => t.status === status).length}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {tasks.filter(t => t.status === status).length === 0 && (
                                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-400 bg-white/50">
                                        <Clock size={20} className="mb-2 opacity-20" />
                                        <span className="text-[10px] uppercase font-bold tracking-widest">Empty</span>
                                    </div>
                                )}
                                
                                {tasks.filter(t => t.status === status).map(task => (
                                    <div key={task._id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`text-[10px] px-2 py-1 rounded-lg font-black uppercase ${
                                                task.priority === 'High' ? 'bg-red-50 text-red-600' : 
                                                task.priority === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                                            }`}>
                                                {task.priority}
                                            </span>
                                            <button onClick={() => deleteTask(task._id)} className="text-slate-300 hover:text-red-500 p-1">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">{task.title}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3">{task.description}</p>
                                        
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                            <div className="flex gap-2 w-full">
                                                {status !== 'To-Do' && (
                                                    <button onClick={() => updateTaskStatus(task._id, status === 'Completed' ? 'In-Progress' : 'To-Do')} className="flex-1 flex justify-center py-2 text-slate-400 hover:bg-slate-50 rounded-xl transition">
                                                        <ChevronLeft size={18} />
                                                    </button>
                                                )}
                                                {status !== 'Completed' && (
                                                    <button onClick={() => updateTaskStatus(task._id, status === 'To-Do' ? 'In-Progress' : 'Completed')} className="flex-1 flex justify-center py-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition">
                                                        <ChevronRight size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* --- RESPONSIVE MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[24px] md:rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        {/* Scrollable Container */}
                        <div className="max-h-[90vh] overflow-y-auto p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><Plus size={20}/></div>
                                    <h2 className="text-xl md:text-2xl font-black text-slate-800">New Task</h2>
                                </div>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
                            </div>

                            <form onSubmit={handleAddTask} className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Task Title</label>
                                    <input className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Enter name..." onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Urgency</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 outline-none" onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Details</label>
                                    <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:bg-white transition-all text-sm" placeholder="Task description..." onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
                                </div>
                                <div className="flex flex-col-reverse md:flex-row gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="w-full py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition">Cancel</button>
                                    <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;