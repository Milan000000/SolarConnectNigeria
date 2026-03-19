import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, Users, Briefcase, Settings, LogOut, Search, 
  Download, Trash2, Edit, Plus, CheckCircle, Clock, XCircle,
  Phone, Mail, MapPin, MessageSquare, Sun, Loader2, ChevronRight,
  UserCheck, UserX, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Lead, Installer, AdminStats } from '../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'leads' | 'installers' | 'stats'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [installers, setInstallers] = useState<Installer[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInstallerModal, setShowInstallerModal] = useState(false);
  const [editingInstaller, setEditingInstaller] = useState<Installer | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, installersRes, statsRes] = await Promise.all([
        fetch('/api/admin/leads'),
        fetch('/api/admin/installers'),
        fetch('/api/admin/stats')
      ]);

      if (leadsRes.status === 401) return navigate('/admin');

      const [leadsData, installersData, statsData] = await Promise.all([
        leadsRes.json(),
        installersRes.json(),
        statsRes.json()
      ]);

      setLeads(leadsData);
      setInstallers(installersData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    navigate('/admin');
  };

  const updateLeadStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) {
      alert('Update failed');
    }
  };

  const deleteLead = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleInstallerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const url = editingInstaller ? `/api/admin/installers/${editingInstaller.id}` : '/api/admin/installers';
      const method = editingInstaller ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setShowInstallerModal(false);
        setEditingInstaller(null);
        fetchData();
      }
    } catch (err) {
      alert('Operation failed');
    }
  };

  const deleteInstaller = async (id: number) => {
    if (!confirm('Are you sure you want to delete this installer?')) return;
    try {
      await fetch(`/api/admin/installers/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const exportCSV = () => {
    window.location.href = '/api/admin/export';
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-solar-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-solar-secondary text-white hidden lg:flex flex-col fixed h-full">
        <div className="p-8 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Sun className="w-8 h-8 text-solar-primary" />
            <span className="text-xl font-bold tracking-tight">SolarConnect</span>
          </Link>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'stats' ? 'bg-solar-primary text-white' : 'hover:bg-white/5 text-blue-100/70'}`}
          >
            <BarChart3 className="w-5 h-5" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'leads' ? 'bg-solar-primary text-white' : 'hover:bg-white/5 text-blue-100/70'}`}
          >
            <Users className="w-5 h-5" /> Leads
          </button>
          <button 
            onClick={() => setActiveTab('installers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'installers' ? 'bg-solar-primary text-white' : 'hover:bg-white/5 text-blue-100/70'}`}
          >
            <Briefcase className="w-5 h-5" /> Installers
          </button>
        </nav>
        <div className="p-6 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen p-6 lg:p-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-solar-secondary capitalize">{activeTab} Management</h1>
            <p className="text-slate-500 text-sm">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'leads' && (
              <button onClick={exportCSV} className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            )}
            {activeTab === 'installers' && (
              <button onClick={() => { setEditingInstaller(null); setShowInstallerModal(true); }} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Installer
              </button>
            )}
          </div>
        </header>

        {/* Stats Section */}
        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="glass-card p-8 border-l-8 border-l-solar-primary">
              <p className="text-slate-500 text-sm font-medium mb-1">Total Leads</p>
              <h3 className="text-4xl font-bold text-solar-secondary">{stats.total}</h3>
            </div>
            <div className="glass-card p-8 border-l-8 border-l-green-500">
              <p className="text-slate-500 text-sm font-medium mb-1">Today's Leads</p>
              <h3 className="text-4xl font-bold text-solar-secondary">{stats.today}</h3>
            </div>
            <div className="glass-card p-8 border-l-8 border-l-blue-500">
              <p className="text-slate-500 text-sm font-medium mb-1">This Week</p>
              <h3 className="text-4xl font-bold text-solar-secondary">{stats.week}</h3>
            </div>
          </div>
        )}

        {/* Leads Table */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search leads by name, location or phone..." 
                className="input-field pl-12 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-6">
                          <div className="font-bold text-solar-secondary">{lead.name}</div>
                          <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" /> {lead.phone}
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" /> {lead.location}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="text-sm font-medium text-slate-700">{lead.systemType}</div>
                          <div className="text-xs text-slate-500 mt-1">Budget: {lead.budget}</div>
                          <div className="text-xs text-slate-500 mt-1">Property: {lead.propertyType}</div>
                        </td>
                        <td className="px-6 py-6">
                          <select 
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1 rounded-full border-none outline-none cursor-pointer ${
                              lead.status === 'new' ? 'bg-blue-100 text-blue-600' :
                              lead.status === 'contacted' ? 'bg-amber-100 text-amber-600' :
                              'bg-green-100 text-green-600'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <button onClick={() => deleteLead(lead.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <a href={`https://wa.me/${lead.phone.replace(/\s/g, '')}`} target="_blank" className="p-2 text-slate-400 hover:text-green-500 transition-colors">
                              <MessageSquare className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Installers Table */}
        {activeTab === 'installers' && (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Business</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subscription</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {installers.map((inst) => (
                    <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-6">
                        <div className="font-bold text-solar-secondary">{inst.businessName}</div>
                        <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {inst.location}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm text-slate-700 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {inst.phone}
                        </div>
                        <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3" /> {inst.email}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          inst.subscriptionStatus === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {inst.subscriptionStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <button onClick={() => { setEditingInstaller(inst); setShowInstallerModal(true); }} className="p-2 text-slate-400 hover:text-solar-primary transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteInstaller(inst.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Installer Modal */}
      <AnimatePresence>
        {showInstallerModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-solar-secondary/60 backdrop-blur-sm"
              onClick={() => setShowInstallerModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-solar-secondary mb-6">{editingInstaller ? 'Edit Installer' : 'Add New Installer'}</h2>
              <form onSubmit={handleInstallerSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Business Name</label>
                  <input name="businessName" defaultValue={editingInstaller?.businessName} required className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                    <input name="phone" defaultValue={editingInstaller?.phone} required className="input-field" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                    <input name="email" type="email" defaultValue={editingInstaller?.email} required className="input-field" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                  <input name="location" defaultValue={editingInstaller?.location} required className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Subscription Status</label>
                  <select name="subscriptionStatus" defaultValue={editingInstaller?.subscriptionStatus} className="input-field">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowInstallerModal(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary py-3">Save Installer</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
