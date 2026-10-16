import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#090d12] border-t border-surface-border py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-black font-extrabold">
              <Icon name="dumbbell" className="w-4 h-4 text-black" />
            </div>
            <span className="text-base font-extrabold tracking-wider text-slate-100">
              FITMEISTER
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            High performance fitness and gym operations platform engineered for modern athletes, certified instructors, and studio managers.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs text-slate-400 font-medium">
            <li>
              <Link to="/" className="hover:text-brand-500 transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/classes" className="hover:text-brand-500 transition-colors">All Classes</Link>
            </li>
            <li>
              <Link to="/forum" className="hover:text-brand-500 transition-colors">Community Forum</Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-brand-500 transition-colors">Member Workspace</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
            Legal & Policies
          </h4>
          <ul className="space-y-2 text-xs text-slate-400 font-medium">
            <li>
              <Link to="/privacy" className="hover:text-brand-500 transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-brand-500 transition-colors">Terms of Service</Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-brand-500 transition-colors">Refund & Cancellation Policy</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
            Member Operations
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            support@fitmeister.com<br />
            Monday to Sunday: 07:00 AM - 10:00 PM EST
          </p>
          <div className="mt-3 text-[11px] text-slate-500">
            Certified Trainers • Guaranteed Capacity
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-surface-border/60 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-2">
        <p>&copy; 2026 FitMeister Platform. All rights reserved.</p>
        <p className="tracking-wider">Verified Class Booking & Training Platform</p>
      </div>
    </footer>
  );
};
export default Footer;
