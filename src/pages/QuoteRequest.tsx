import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sun, Send, CheckCircle2, Loader2, UserCheck } from 'lucide-react';

export default function QuoteRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [assignedInstaller, setAssignedInstaller] = useState<{ id: number; name: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    propertyType: 'Home',
    budget: 'Under 500k',
    systemType: 'Small (lights + fan)',
    notes: ''
  });

  useEffect(() => {
    if (location.state?.assignedInstallerId && location.state?.installerName) {
      setAssignedInstaller({
        id: location.state.assignedInstallerId,
        name: location.state.installerName
      });
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          assignedInstallerId: assignedInstaller?.id
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Submission failed');
      }

      // Generate WhatsApp message
      const installerText = assignedInstaller ? `%0A*Assigned Installer:* ${assignedInstaller.name}` : '';
      const message = `New Solar Quote Request!${installerText}%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Location:* ${formData.location}%0A*Property:* ${formData.propertyType}%0A*Budget:* ${formData.budget}%0A*System:* ${formData.systemType}%0A*Notes:* ${formData.notes}`;
      const whatsappUrl = `https://wa.me/2347085276095?text=${message}`;

      // Navigate to thank you page with whatsapp link
      navigate('/thank-you', { state: { whatsappUrl } });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <Link to="/" className="w-16 h-16 bg-solar-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-solar-primary/20 transition-colors">
              <Sun className="w-8 h-8 text-solar-primary" />
            </Link>
            <h1 className="text-3xl font-bold text-solar-secondary mb-2">Request Your Free Quote</h1>
            <p className="text-slate-500">Fill out the form below and we'll match you with the best solar installers.</p>
            
            {assignedInstaller && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-solar-primary/10 text-solar-primary rounded-full text-sm font-bold border border-solar-primary/20"
              >
                <UserCheck className="w-4 h-4" />
                Requesting from: {assignedInstaller.name}
                <button 
                  onClick={() => setAssignedInstaller(null)}
                  className="ml-2 hover:text-solar-secondary transition-colors"
                >
                  ×
                </button>
              </motion.div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="input-field"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="input-field"
                  placeholder="0801 234 5678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Location (City/Area)</label>
                <input
                  type="text"
                  name="location"
                  required
                  className="input-field"
                  placeholder="Kaduna North, Kaduna"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Property Type</label>
                <select
                  name="propertyType"
                  className="input-field"
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option>Home</option>
                  <option>Office</option>
                  <option>Shop</option>
                  <option>Factory</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Budget Range</label>
                <select
                  name="budget"
                  className="input-field"
                  value={formData.budget}
                  onChange={handleChange}
                >
                  <option>Under 500k</option>
                  <option>500k - 1.5M</option>
                  <option>1.5M - 5M</option>
                  <option>Above 5M</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Type of System</label>
                <select
                  name="systemType"
                  className="input-field"
                  value={formData.systemType}
                  onChange={handleChange}
                >
                  <option>Small (lights + fan)</option>
                  <option>Medium (TV + fridge)</option>
                  <option>Full home (AC + pump)</option>
                  <option>Industrial</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Additional Notes (Optional)</label>
              <textarea
                name="notes"
                className="input-field min-h-[120px] resize-none"
                placeholder="Tell us more about your power needs..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Submit Request <Send className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400 mt-4">
              By submitting, you agree to our terms and allow verified installers to contact you.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
