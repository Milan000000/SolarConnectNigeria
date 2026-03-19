import { Sun, Battery, ShieldCheck, Zap, ArrowRight, CheckCircle2, Star, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Installer {
  id: number;
  businessName: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [recommendedInstallers, setRecommendedInstallers] = useState<Installer[]>([]);
  const [loadingInstallers, setLoadingInstallers] = useState(true);

  useEffect(() => {
    fetch('/api/installers/recommended')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecommendedInstallers(data);
        }
      })
      .catch(err => console.error('Error fetching installers:', err))
      .finally(() => setLoadingInstallers(false));
  }, []);

  const handleInstallerClick = (installer: Installer) => {
    navigate('/quote', { 
      state: { 
        assignedInstallerId: installer.id,
        installerName: installer.businessName 
      } 
    });
  };

  const benefits = [
    {
      icon: <Zap className="w-8 h-8 text-solar-primary" />,
      title: "Save on Bills",
      description: "Reduce your monthly electricity costs by up to 90% with clean solar energy."
    },
    {
      icon: <Battery className="w-8 h-8 text-solar-primary" />,
      title: "Reliable Power",
      description: "Say goodbye to power outages. Enjoy 24/7 electricity for your home or business."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-solar-primary" />,
      title: "Verified Installers",
      description: "We connect you only with certified and highly-rated solar professionals."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Submit Request",
      description: "Fill out our simple form with your power needs and location."
    },
    {
      number: "02",
      title: "Get Matched",
      description: "We match your request with the best verified installers in your area."
    },
    {
      number: "03",
      title: "Installer Contacts You",
      description: "Receive quotes and choose the best plan for your budget."
    }
  ];

  const testimonials = [
    {
      name: "Chidi Okafor",
      role: "Homeowner in Kaduna",
      text: "SolarConnect helped me find an amazing installer. My house has been on 24/7 power for 6 months now!",
      stars: 5
    },
    {
      name: "Aisha Bello",
      role: "Shop Owner in Kaduna",
      text: "I was worried about the cost, but the installer SolarConnect matched me with gave me a great payment plan.",
      stars: 5
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold text-solar-secondary leading-tight mb-6">
                Get Reliable <span className="text-solar-primary">Solar Installation</span> Near You
              </h1>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
                Request quotes from trusted solar installers in your area. Save money, enjoy constant power, and join the clean energy revolution in Nigeria.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/quote" className="btn-primary flex items-center justify-center gap-2 text-lg">
                  Get Free Quote <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/contact" className="btn-secondary flex items-center justify-center gap-2 text-lg">
                  Contact Us
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                  ))}
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  Joined by <span className="text-solar-secondary font-bold">500+</span> happy customers
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img src="https://picsum.photos/seed/solar-panel/800/600" className="w-full h-full object-cover" alt="Solar Panels" />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-solar-primary rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-solar-secondary rounded-full blur-3xl opacity-10"></div>
            </motion.div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-solar-primary/5 -skew-x-12 transform origin-top-right"></div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-solar-secondary mb-4">Why Choose Solar?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Experience the freedom of clean, renewable energy tailored to your needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-all"
              >
                <div className="mb-6 p-3 bg-white rounded-xl w-fit shadow-sm">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-solar-secondary mb-3">{benefit.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-solar-secondary text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto">Three simple steps to your solar-powered future.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, idx) => (
              <div key={idx} className="relative text-center">
                <div className="text-6xl font-black text-white/10 absolute -top-10 left-1/2 -translate-x-1/2">{step.number}</div>
                <h3 className="text-xl font-bold mb-4 relative z-10">{step.title}</h3>
                <p className="text-blue-100/70 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        <Sun className="absolute -bottom-20 -right-20 w-96 h-96 text-white/5" />
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-solar-secondary mb-4">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="glass-card p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-solar-primary text-solar-primary" />
                  ))}
                </div>
                <p className="text-slate-700 italic mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={`https://picsum.photos/seed/${t.name}/100/100`} className="w-12 h-12 rounded-full" alt={t.name} />
                  <div>
                    <h4 className="font-bold text-solar-secondary">{t.name}</h4>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Companies Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-solar-secondary mb-4">Recommended Solar Partners</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Top-tier solar companies we've worked with and highly recommend for your energy needs.</p>
          </div>
          
          {loadingInstallers ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-solar-primary animate-spin" />
            </div>
          ) : recommendedInstallers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {recommendedInstallers.map((installer) => (
                <motion.div
                  key={installer.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleInstallerClick(installer)}
                  className="p-6 cursor-pointer transition-all flex flex-col items-center gap-4 group"
                >
                  <div className="w-full h-32 bg-slate-50 rounded-2xl flex flex-col items-center justify-center p-6 border-2 border-transparent group-hover:border-solar-primary/30 group-hover:bg-white shadow-sm group-hover:shadow-md transition-all">
                    <span className="font-bold text-solar-secondary text-center text-lg">{installer.businessName}</span>
                    <span className="text-xs text-solar-primary mt-2 font-semibold uppercase tracking-wider">Request Directly</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              No recommended installers available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-solar-primary rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">Ready to Switch to Solar?</h2>
              <p className="text-lg mb-10 text-white/90">Join hundreds of Nigerians saving money and enjoying constant power.</p>
              <Link to="/quote" className="bg-white text-solar-primary hover:bg-slate-50 px-10 py-4 rounded-xl font-bold text-lg transition-all inline-block shadow-lg">
                Get Your Free Quote Now
              </Link>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
