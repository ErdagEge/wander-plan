import React, { useState } from 'react';
import { Itinerary, DayPlan, Activity } from '../types';
import { Clock, MapPin, DollarSign, Sunrise, Sun, Moon, Sparkles, Send, ArrowLeft, Loader2, Download, Printer } from 'lucide-react';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onRefine: (feedback: string) => void;
  isRefining: boolean;
  onReset: () => void;
}

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => (
  <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow mb-3 last:mb-0 break-inside-avoid">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-bold text-slate-800">{activity.title}</h4>
      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{activity.estimatedCost}</span>
    </div>
    <p className="text-sm text-slate-600 mb-3">{activity.description}</p>
    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
      <div className="flex items-center">
        <Clock className="w-3 h-3 mr-1" /> {activity.duration}
      </div>
      <div className="flex items-center">
        <MapPin className="w-3 h-3 mr-1" /> {activity.location}
      </div>
    </div>
    {activity.tags.length > 0 && (
      <div className="mt-3 flex flex-wrap gap-1">
        {activity.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-md uppercase font-bold tracking-wider">
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

const DaySection: React.FC<{ day: DayPlan }> = ({ day }) => {
  return (
    <div className="mb-12 relative pl-8 border-l-2 border-slate-200 last:border-0 last:mb-0 break-inside-avoid">
      {/* Day Marker */}
      <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-slate-50 z-10 print:ring-0">
        {day.dayNumber}
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">Day {day.dayNumber}: {day.theme}</h3>
        {/* If date string exists in format YYYY-MM-DD, try to format it nicely */}
        <p className="text-slate-500 text-sm font-medium">{day.date}</p>
      </div>

      <div className="space-y-6">
        {day.morning.length > 0 && (
            <div className="group">
                <h4 className="flex items-center text-sm font-bold text-amber-600 uppercase tracking-wider mb-3">
                    <Sunrise className="w-4 h-4 mr-2" /> Morning
                </h4>
                <div className="space-y-3">
                    {day.morning.map((act, i) => <ActivityCard key={i} activity={act} />)}
                </div>
            </div>
        )}

        {day.afternoon.length > 0 && (
             <div className="group">
                <h4 className="flex items-center text-sm font-bold text-orange-600 uppercase tracking-wider mb-3">
                    <Sun className="w-4 h-4 mr-2" /> Afternoon
                </h4>
                <div className="space-y-3">
                    {day.afternoon.map((act, i) => <ActivityCard key={i} activity={act} />)}
                </div>
            </div>
        )}

        {day.evening.length > 0 && (
             <div className="group">
                <h4 className="flex items-center text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3">
                    <Moon className="w-4 h-4 mr-2" /> Evening
                </h4>
                <div className="space-y-3">
                    {day.evening.map((act, i) => <ActivityCard key={i} activity={act} />)}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, onRefine, isRefining, onReset }) => {
  const [feedback, setFeedback] = useState("");

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      onRefine(feedback);
      setFeedback("");
    }
  };

  const handleExport = () => {
    let content = `${itinerary.title}\n${itinerary.summary}\n\n`;

    itinerary.days.forEach(day => {
        content += `Day ${day.dayNumber}: ${day.theme} (${day.date})\n`;
        content += `----------------------------------------\n`;
        
        const formatActivities = (label: string, activities: Activity[]) => {
            if (activities.length === 0) return;
            content += `\n${label}:\n`;
            activities.forEach(act => {
                content += `- ${act.title} (${act.duration}, ${act.estimatedCost})\n`;
                content += `  ${act.description}\n`;
                content += `  Location: ${act.location}\n`;
            });
        };

        formatActivities('Morning', day.morning);
        formatActivities('Afternoon', day.afternoon);
        formatActivities('Evening', day.evening);
        content += `\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${itinerary.title.replace(/\s+/g, '_')}_Itinerary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto h-[calc(100vh-6rem)] print:h-auto print:block">
      
      {/* Sidebar / Controls */}
      <div className="lg:w-1/3 flex flex-col gap-6 print:w-full print:mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full lg:sticky lg:top-6 print:shadow-none print:border-none print:p-0 print:h-auto">
          <div className="mb-6">
            <button 
                onClick={onReset}
                className="flex items-center text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors print:hidden"
            >
                <ArrowLeft className="w-4 h-4 mr-1" /> Start New Plan
            </button>
            <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-2">{itinerary.title}</h1>
            
            <div className="flex gap-2 mb-4 print:hidden">
                <button
                    onClick={handleExport}
                    className="flex items-center px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    title="Download as Text"
                >
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Export Text
                </button>
                <button
                    onClick={() => window.print()}
                    className="flex items-center px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    title="Print or Save as PDF"
                >
                    <Printer className="w-3.5 h-3.5 mr-1.5" /> Print / PDF
                </button>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">{itinerary.summary}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-auto print:hidden">
             <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-sm">
                <Sparkles className="w-4 h-4" /> AI Trip Assistant
             </div>
             <p className="text-sm text-blue-700 mb-4">
               Not quite right? Tell me what to change, and I'll update the plan instantly.
             </p>
             
             <form onSubmit={handleRefineSubmit} className="relative">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="e.g., 'Make day 2 more relaxing' or 'Add a vegan lunch option on Day 3'..."
                  className="w-full p-3 pr-10 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 bg-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleRefineSubmit(e);
                    }
                  }}
                />
                <button 
                    type="submit"
                    disabled={isRefining || !feedback.trim()}
                    className="absolute bottom-3 right-3 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isRefining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
             </form>
          </div>
          
           {isRefining && (
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg flex items-center animate-pulse print:hidden">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating itinerary based on your feedback...
                </div>
            )}
        </div>
      </div>

      {/* Main Itinerary Scrollable */}
      <div className="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 overflow-y-auto custom-scrollbar print:w-full print:shadow-none print:border-none print:p-0 print:overflow-visible">
         {itinerary.days.map((day) => (
             <DaySection key={day.dayNumber} day={day} />
         ))}
         <div className="mt-8 text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 print:hidden">
            <p className="text-slate-500 font-medium">End of Itinerary</p>
            <p className="text-xs text-slate-400 mt-1">Safe travels!</p>
         </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;