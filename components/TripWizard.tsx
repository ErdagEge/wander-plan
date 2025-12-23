import React, { useState, useEffect, useRef } from 'react';
import { UserPreferences, BudgetLevel, WalkingTolerance } from '../types';
import { MapPin, Calendar, Users, DollarSign, Footprints, Heart, Loader2, Plus, Minus, ChevronDown } from 'lucide-react';

interface TripWizardProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const INTERESTS_OPTIONS = [
  "Museums & History", "Nature & Parks", "Food & Dining", 
  "Adventure & Sports", "Shopping", "Relaxation", 
  "Theme Parks", "Local Culture", "Photography"
];

const POPULAR_DESTINATIONS = [
  "Paris, France", "Tokyo, Japan", "New York City, USA", "Rome, Italy", "London, UK",
  "Barcelona, Spain", "Dubai, UAE", "Singapore", "Amsterdam, Netherlands", "Bangkok, Thailand",
  "Sydney, Australia", "Istanbul, Turkey", "Kyoto, Japan", "Bali, Indonesia", "Maui, Hawaii",
  "Cape Town, South Africa", "Rio de Janeiro, Brazil", "Lisbon, Portugal", "Santorini, Greece",
  "Los Angeles, USA", "San Francisco, USA", "Las Vegas, USA", "Miami, USA", "Chicago, USA",
  "Toronto, Canada", "Vancouver, Canada", "Cancun, Mexico", "Machu Picchu, Peru",
  "Cairo, Egypt", "Marrakech, Morocco", "Hong Kong", "Seoul, South Korea", "Mumbai, India",
  "Prague, Czech Republic", "Vienna, Austria", "Berlin, Germany", "Munich, Germany",
  "Zurich, Switzerland", "Stockholm, Sweden", "Copenhagen, Denmark", "Oslo, Norway",
  "Helsinki, Finland", "Reykjavik, Iceland", "Dublin, Ireland", "Edinburgh, Scotland"
];

const TripWizard: React.FC<TripWizardProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserPreferences>({
    destination: '',
    startDate: new Date().toISOString().split('T')[0],
    duration: 3,
    budget: BudgetLevel.Moderate,
    walking: WalkingTolerance.Medium,
    interests: [],
    travelers: '', 
  });

  // Local state for specialized UI
  const [travelerCounts, setTravelerCounts] = useState({ adults: 2, children: 1 });
  const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  
  const travelerRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (travelerRef.current && !travelerRef.current.contains(event.target as Node)) {
        setShowTravelerDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setShowDestSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update traveler string whenever counts change
  useEffect(() => {
    const { adults, children } = travelerCounts;
    const parts = [];
    if (adults > 0) parts.push(`${adults} Adult${adults !== 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} Child${children !== 1 ? 'ren' : ''}`);
    setFormData(prev => ({ ...prev, travelers: parts.join(', ') }));
  }, [travelerCounts]);

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, destination: value }));
    
    if (value.length > 0) {
      const filtered = POPULAR_DESTINATIONS.filter(dest => 
        dest.toLowerCase().includes(value.toLowerCase())
      );
      setDestinationSuggestions(filtered);
      setShowDestSuggestions(true);
    } else {
      setShowDestSuggestions(false);
    }
  };

  const selectDestination = (dest: string) => {
    setFormData(prev => ({ ...prev, destination: dest }));
    setShowDestSuggestions(false);
  };

  const updateTravelers = (type: 'adults' | 'children', delta: number) => {
    setTravelerCounts(prev => {
      const newVal = prev[type] + delta;
      if (newVal < 0) return prev;
      if (type === 'adults' && newVal < 1) return prev; // Minimum 1 adult
      return { ...prev, [type]: newVal };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-visible border border-slate-100">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white rounded-t-2xl">
        <h2 className="text-3xl font-bold mb-2">Plan Your Perfect Family Trip</h2>
        <p className="opacity-90">Tell us a little about your travel plans, and our AI will handle the rest.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        
        {/* Destination & Logistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
          
          {/* Searchable Destination */}
          <div className="space-y-2 relative" ref={destRef}>
            <label className="flex items-center text-sm font-medium text-slate-700">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" /> Destination
            </label>
            <div className="relative">
                <input
                required
                type="text"
                placeholder="e.g. Tokyo, Japan"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={formData.destination}
                onChange={handleDestinationChange}
                onFocus={() => {
                    if (formData.destination) setShowDestSuggestions(true);
                }}
                autoComplete="off"
                />
                 {showDestSuggestions && destinationSuggestions.length > 0 && (
                    <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                        {destinationSuggestions.map((dest) => (
                        <li 
                            key={dest}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 transition-colors"
                            onClick={() => selectDestination(dest)}
                        >
                            {dest}
                        </li>
                        ))}
                    </ul>
                )}
            </div>
          </div>

          {/* Travelers Dropdown */}
          <div className="space-y-2 relative" ref={travelerRef}>
            <label className="flex items-center text-sm font-medium text-slate-700">
              <Users className="w-4 h-4 mr-2 text-blue-500" /> Travelers
            </label>
            
            <button
                type="button"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-left flex justify-between items-center"
                onClick={() => setShowTravelerDropdown(!showTravelerDropdown)}
            >
                <span className="text-slate-700 truncate">
                    {formData.travelers}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showTravelerDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showTravelerDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50 w-full min-w-[200px]">
                    {/* Adults */}
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="font-semibold text-sm text-slate-900">Adults</p>
                            <p className="text-xs text-slate-500">Ages 13+</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                type="button" 
                                onClick={() => updateTravelers('adults', -1)}
                                className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                                disabled={travelerCounts.adults <= 1}
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-4 text-center font-medium text-slate-900">{travelerCounts.adults}</span>
                            <button 
                                type="button" 
                                onClick={() => updateTravelers('adults', 1)}
                                className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    {/* Children */}
                    <div className="flex justify-between items-center">
                         <div>
                            <p className="font-semibold text-sm text-slate-900">Children</p>
                            <p className="text-xs text-slate-500">Ages 0-12</p>
                        </div>
                         <div className="flex items-center gap-3">
                            <button 
                                type="button" 
                                onClick={() => updateTravelers('children', -1)}
                                className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                                disabled={travelerCounts.children <= 0}
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-4 text-center font-medium text-slate-900">{travelerCounts.children}</span>
                            <button 
                                type="button" 
                                onClick={() => updateTravelers('children', 1)}
                                className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-700">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" /> Start Date
            </label>
            <div className="relative">
                <input
                required
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                onClick={(e) => {
                  try {
                    // @ts-ignore
                    if (typeof e.currentTarget.showPicker === 'function') {
                      // @ts-ignore
                      e.currentTarget.showPicker();
                    }
                  } catch (error) {
                    // Ignore if showPicker is not supported
                  }
                }}
                />
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 relative z-10">
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
        <div className="pt-4 border-t border-slate-100 relative z-10">
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

        <div className="pt-6 relative z-10">
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