import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
        <div className="border-b border-surface-border pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold uppercase tracking-wider">
            <Icon name="shield" className="w-3.5 h-3.5" />
            Legal & Compliance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            FitMeister Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last Updated: October 2026 • Effective Worldwide
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
            <p>
              When you create an account on FitMeister as an athlete, member, trainer, or administrator, we collect personal information including your full name, email address, profile avatar, and account role. For trainers, we may collect professional certifications and experience records to verify credentials.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. How We Use Your Information</h2>
            <p>
              We use your information exclusively to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Process class bookings, seat reservations, and attendance rosters.</li>
              <li>Provide role-governed access to workout schedules and trainer curriculums.</li>
              <li>Facilitate community forum discussions and direct coaching feedback.</li>
              <li>Authenticate your account securely and prevent unauthorized access or fraud.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Data Storage & Security Standards</h2>
            <p>
              Your data is stored in enterprise relational databases with encrypted data-at-rest and transport layer security (TLS 1.3). Passwords are cryptographically hashed using salted bcrypt hashes. We never store plaintext passwords or sensitive financial payment tokens on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Cookies & Authentication Tokens</h2>
            <p>
              FitMeister uses local storage and session tokens solely for maintaining your authenticated session state and user interface preferences (such as light or dark display mode). We do not use third-party advertising tracking cookies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Your Privacy Rights</h2>
            <p>
              You have the right to request access to your personal data, rectify inaccuracies, or delete your account at any time. For privacy inquiries or data removal requests, reach out to <span className="font-bold text-brand-500">privacy@fitmeister.com</span>.
            </p>
          </section>
        </div>

        <div className="border-t border-surface-border pt-6 flex justify-between items-center text-xs">
          <Link to="/" className="text-brand-500 font-bold hover:underline">
            ← Return to Homepage
          </Link>
          <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">
            Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
};
export default PrivacyPolicy;
