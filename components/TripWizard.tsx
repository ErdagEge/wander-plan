import React, { useState } from 'react';
import { UserPreferences, BudgetLevel, WalkingTolerance } from '../types';
import { MapPin, Calendar, Users, DollarSign, Footprints, Heart, Loader2 } from 'lucide-react';

interface TripWizardProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const INTERESTS_OPTIONS = [
  "Museums & History", "Nature & Parks", "Food & Dining", 
  "Adventure & Sports", "Shopping", "Relaxation", 
  "Theme Parks", "Local Culture", "Photography"
];

const TripWizard: React.FC<TripWizardProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserPreferences>({
    destination: '',
    startDate: new Date().toISOString().split('T')[0],
    duration: 3,
    budget: BudgetLevel.Moderate,
    walking: WalkingTolerance.Medium,
    interests: [],
    travelers: '2 Adults, 1 Child',
  });

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Plan Your Perfect Family Trip</h2>
        <p className="opacity-90">Tell us a little about your travel plans, and our AI will handle the rest.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        
        {/* Destination & Logistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" /> Destination
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Tokyo, Japan"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
              <Users className="w-4 h-4 mr-2 text-blue-500" /> Travelers
            </label>
            <input
              required
              type="text"
              placeholder="e.g. 2 Adults, 2 Kids (5, 8)"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={formData.travelers}
              onChange={(e) => setFormData({...formData, travelers: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" /> Start Date
            </label>
            <input
              required
              type="date"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" /> Duration (Days)
            </label>
            <input
              required
              type="number"
              min="1"
              max="14"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 1})}
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
           <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
              <DollarSign className="w-4 h-4 mr-2 text-green-500" /> Budget Level
            </label>
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value as BudgetLevel})}
            >
              {Object.values(BudgetLevel).map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
              <Footprints className="w-4 h-4 mr-2 text-orange-500" /> Walking Tolerance
            </label>
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={formData.walking}
              onChange={(e) => setFormData({...formData, walking: e.target.value as WalkingTolerance})}
            >
              {Object.values(WalkingTolerance).map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Interests */}
        <div className="pt-4 border-t border-slate-100">
           <label className="flex items-center text-sm font-medium text-slate-700 mb-4">
              <Heart className="w-4 h-4 mr-2 text-red-500" /> Interests (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-3">
              {INTERESTS_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-blue-600 text-white shadow-md transform scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Generating Itinerary...
              </>
            ) : (
              "Generate My Plan"
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-3">Powered by Gemini AI. Plans may take a few seconds to generate.</p>
        </div>
      </form>
    </div>
  );
};

export default TripWizard;
