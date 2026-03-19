import { Mail, Phone, MapPin, MessageSquare, Send, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Contact() {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-solar-primary" />,
      title: "Email Us",
      value: "davidaiki17@gmail.com",
      link: "mailto:davidaiki17@gmail.com"
    },
    {
      icon: <Phone className="w-6 h-6 text-solar-primary" />,
      title: "Call Us",
      value: "0708 527 6095",
      link: "tel:+2347085276095"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-solar-primary" />,
      title: "WhatsApp",
      value: "0708 527 6095",
      link: "https://wa.me/2347085276095"
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-solar-secondary mb-4">Get in Touch</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">Have questions about solar installation? We're here to help you make the switch.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((info, idx) => (
            <motion.a
              key={idx}
              href={info.link}
              whileHover={{ y: -5 }}
              className="glass-card p-8 text-center flex flex-col items-center gap-4 transition-all"
            >
              <div className="p-4 bg-solar-primary/10 rounded-full">{info.icon}</div>
              <h3 className="text-lg font-bold text-solar-secondary">{info.title}</h3>
              <p className="text-slate-600 font-medium">{info.value}</p>
            </motion.a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <Sun className="w-10 h-10 text-solar-primary" />
              <h2 className="text-3xl font-bold text-solar-secondary">SolarConnect Nigeria</h2>
            </Link>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our mission is to make solar energy accessible to every Nigerian household and business. We provide the platform, the installers provide the expertise, and you get the power.
            </p>
            <div className="flex items-center gap-4 text-slate-500">
              <MapPin className="w-6 h-6 text-solar-primary" />
              <span>Headquarters: Kaduna, Nigeria</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8"
          >
            <h3 className="text-2xl font-bold text-solar-secondary mb-6">Send a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" className="input-field" />
                <input type="email" placeholder="Your Email" className="input-field" />
              </div>
              <input type="text" placeholder="Subject" className="input-field" />
              <textarea placeholder="Your Message" className="input-field min-h-[150px] resize-none"></textarea>
              <button type="button" className="w-full btn-primary flex items-center justify-center gap-2">
                Send Message <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
