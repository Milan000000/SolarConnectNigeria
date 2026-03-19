import { motion } from 'motion/react';
import { CheckCircle2, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function ThankYou() {
  const location = useLocation();
  const whatsappUrl = location.state?.whatsappUrl;

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-12"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-solar-secondary mb-4 leading-tight">Your Request Has Been Received!</h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            Thank you for choosing SolarConnect Nigeria. A verified solar installer will contact you shortly to provide your free quote.
          </p>

          <div className="space-y-4">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-primary bg-[#25D366] hover:bg-[#128C7E] border-none flex items-center justify-center gap-3 py-4 text-lg"
              >
                <MessageSquare className="w-6 h-6" /> Send to Admin WhatsApp
              </a>
            )}
            <Link
              to="/"
              className="w-full btn-secondary bg-slate-100 text-slate-700 hover:bg-slate-200 border-none flex items-center justify-center gap-2 py-4 text-lg"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
