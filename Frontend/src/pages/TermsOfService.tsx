import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

export const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
        <div className="border-b border-surface-border pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold uppercase tracking-wider">
            <Icon name="shield" className="w-3.5 h-3.5" />
            Terms & Conditions
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            FitMeister Terms of Service
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last Updated: October 2026 • Agreement for Platform Users
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, registering an account, or reserving classes on FitMeister, you agree to be bound by these Terms of Service and all applicable local fitness studio regulations. If you do not agree with any of these terms, you are prohibited from using this platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. User Accounts & Integrity</h2>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Creating fraudulent accounts, attempting privilege escalation, or scraping studio availability without authorization is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Class Reservations & Capacity</h2>
            <p>
              Each class hosted on FitMeister has an enforced physical capacity limit to maintain participant safety and instructional quality. Once a class reaches full capacity, additional bookings are locked. Members are expected to arrive punctually for reserved sessions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Trainer Code of Conduct</h2>
            <p>
              Instructors applying to publish curriculums on FitMeister must hold valid certifications in their advertised disciplines. FitMeister reserves the right to suspend or revoke trainer publishing privileges if safety or quality benchmarks are violated.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Physical Activity Disclaimer</h2>
            <p>
              Participating in physical fitness and athletic training involves inherent risks. Users should consult a qualified physician before undertaking strenuous exercise programs. FitMeister and its instructors are not liable for personal injuries resulting from improper execution of exercises.
            </p>
          </section>
        </div>

        <div className="border-t border-surface-border pt-6 flex justify-between items-center text-xs">
          <Link to="/" className="text-brand-500 font-bold hover:underline">
            ← Return to Homepage
          </Link>
          <Link to="/refund-policy" className="text-slate-400 hover:text-white transition-colors">
            Refund Policy →
          </Link>
        </div>
      </div>
    </div>
  );
};
export default TermsOfService;
