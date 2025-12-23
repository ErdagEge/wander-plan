import React, { useState } from 'react';
import { UserPreferences, Itinerary } from './types';
import TripWizard from './components/TripWizard';
import ItineraryDisplay from './components/ItineraryDisplay';
import { startNewTripSession, refineItinerary } from './services/geminiService';
import { Compass, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTrip = async (prefs: UserPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await startNewTripSession(prefs);
      setItinerary(result);
    } catch (err) {
      setError("Failed to generate itinerary. Please try again. " + (err instanceof Error ? err.message : ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineTrip = async (feedback: string) => {
    setIsRefining(true);
    setError(null);
    try {
      const updated = await refineItinerary(feedback);
      setItinerary(updated);
    } catch (err) {
      setError("Failed to update itinerary. " + (err instanceof Error ? err.message : ''));
    } finally {
      setIsRefining(false);
    }
  };

  const resetApp = () => {
    setItinerary(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={resetApp}>
            <div className="bg-blue-600 p-1.5 rounded-lg">
                <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">
              WanderPlan
            </span>
          </div>
          <div className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
            Powered by Google Gemini
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        
        {error && (
            <div className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
            </div>
        )}

        {!itinerary ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
             <TripWizard onSubmit={handleCreateTrip} isLoading={isLoading} />
          </div>
        ) : (
          <ItineraryDisplay 
            itinerary={itinerary} 
            onRefine={handleRefineTrip} 
            isRefining={isRefining}
            onReset={resetApp}
          />
        )}
      </main>

    </div>
  );
};

export default App;
