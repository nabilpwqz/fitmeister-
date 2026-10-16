import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

export const RefundPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
        <div className="border-b border-surface-border pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold uppercase tracking-wider">
            <Icon name="shield" className="w-3.5 h-3.5" />
            Billing & Cancellations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            FitMeister Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last Updated: October 2026 • Clear & Transparent Policies
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Single Class Session Cancellations</h2>
            <p>
              Members may cancel a booked class session up to 12 hours prior to the scheduled start time for a 100% full refund or session credit. Cancellations made under 12 hours before class commencement are non-refundable to ensure fair compensation for reserved trainer time and slot allocation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Instructor Class Cancellations</h2>
            <p>
              If a trainer cancels a scheduled class session due to unforeseen circumstances, illness, or emergency, all enrolled attendees receive an immediate automatic full refund to their original payment method plus a complimentary session credit voucher.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Monthly Memberships & Subscriptions</h2>
            <p>
              Monthly recurring memberships can be cancelled at any time through your Member Workspace dashboard before the next billing cycle. Cancellations take effect at the end of the current paid billing period without surprise renewal charges.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Refund Processing Timeframes</h2>
            <p>
              Approved refunds are processed immediately by our billing gateway and typically appear on your credit card or bank account statement within 3 to 5 business days, depending on your banking institution.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">5. How to Request a Refund</h2>
            <p>
              To initiate a cancellation or refund request, navigate to your booking roster in the dashboard or contact our member operations team at <span className="font-bold text-brand-500">support@fitmeister.com</span> with your booking confirmation number.
            </p>
          </section>
        </div>

        <div className="border-t border-surface-border pt-6 flex justify-between items-center text-xs">
          <Link to="/" className="text-brand-500 font-bold hover:underline">
            ← Return to Homepage
          </Link>
          <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">
            Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
};
export default RefundPolicy;
