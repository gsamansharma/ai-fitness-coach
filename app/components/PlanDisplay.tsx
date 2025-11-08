'use client';

import { useState, useRef } from 'react';
import { Loader2, Utensils, Dumbbell, Sparkles, Lightbulb, X, ChevronRight, Download, Play, StopCircle } from 'lucide-react';
import { Plan } from '@/app/types';

type ActiveTab = 'workout' | 'diet' | 'tips';

export default function PlanDisplay({ plan }: { plan: Plan }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('workout');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const componentRef = useRef<HTMLDivElement>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [speakingItem, setSpeakingItem] = useState<string | null>(null);
  const handlePrint = () => {
    const printContents = componentRef.current?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Your Personalized Fitness Plan</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              color: #333;
            }
            h1 {
              color: #6366f1;
              text-align: center;
              margin-bottom: 30px;
            }
            h2 {
              color: #6366f1;
              margin-top: 30px;
              margin-bottom: 15px;
              border-bottom: 2px solid #6366f1;
              padding-bottom: 5px;
            }
            h3 {
              color: #333;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            .day-section {
              margin-bottom: 25px;
              break-inside: avoid;
            }
            .exercise-item, .meal-item {
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .exercise-details {
              color: #666;
              font-size: 0.9em;
            }
            .meal-type {
              font-weight: bold;
              color: #6366f1;
              text-transform: uppercase;
              font-size: 0.85em;
            }
            .tips-list {
              list-style: disc;
              padding-left: 20px;
            }
            .tips-list li {
              margin-bottom: 8px;
            }
            .motivation {
              font-style: italic;
              border-left: 3px solid #6366f1;
              padding-left: 15px;
              margin-top: 15px;
              color: #555;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const generateImage = async (prompt: string, type: 'exercise' | 'food') => {
    setIsLoadingImage(true);
    setSelectedImage(null);
    const fullPrompt = type === 'exercise'
      ? `High-quality, professional fitness photo of ${prompt}`
      : `High-quality, delicious food photography of ${prompt}, top-down view`;

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });
      if (!response.ok) throw new Error('Failed to generate image');
      const data = await response.json();
      setSelectedImage(data.imageUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingImage(false);
    }
  };

  const playAudio = async (textToSpeak: string, itemKey: string) => {
    if (audio && speakingItem === itemKey) {
      stopAudio();
      return;
    }

    if (audio) {
      audio.pause();
    }
    
    setSpeakingItem(itemKey);

    try {
      const response = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak }),
      });

      if (!response.ok) throw new Error('Failed to generate audio');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const newAudio = new Audio(url);
      setAudio(newAudio);
      newAudio.play();
      
      newAudio.onended = () => {
        setSpeakingItem(null);
      };

    } catch (err) {
      console.error(err);
      setSpeakingItem(null);
    }
  };

  const stopAudio = () => {
    if (audio) {
      audio.pause();
    }
    setSpeakingItem(null);
  };

  const getWorkoutDayText = (day: Plan['workoutPlan'][0]) => {
    if (day.exercises.length === 0 || day.dayTitle.toLowerCase().includes('rest')) {
      return `Day ${day.day}: ${day.dayTitle}. Rest and recover.`;
    }
    const exercisesText = day.exercises.map(ex => 
      `${ex.name}: ${ex.sets ? `${ex.sets} sets` : ''} ${ex.reps ? `by ${ex.reps}` : ''} ${ex.duration ? `${ex.duration}` : ''}.`
    ).join(' ');
    return `Day ${day.day}: ${day.dayTitle}. ${exercisesText}`;
  };

  const getDietDayText = (day: Plan['dietPlan'][0]) => {
    return `Day ${day.day} Meals. 
      Breakfast: ${day.meals.breakfast}.
      Lunch: ${day.meals.lunch}.
      Dinner: ${day.meals.dinner}.
      Snacks: ${day.meals.snacks}.
    `;
  };

  const TabButton = ({
    tabName,
    icon: Icon,
    label,
  }: {
    tabName: ActiveTab;
    icon: React.ElementType;
    label: string;
  }) => (
    <button
      onClick={() => {
        setActiveTab(tabName);
        setExpandedDay(1);
        stopAudio();
      }}
      className={`
        flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 rounded-lg font-medium transition-all duration-200
        ${activeTab === tabName
          ? 'bg-(--accent-color) text-white shadow-lg'
          : 'bg-(--surface-color) text-(--font-color)/70'
        }
      `}
    >
      <Icon size={18} />
      <span className="text-sm md:text-base">{label}</span>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto mt-8 md:mt-16 px-4 pb-8">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-(--accent-color) mb-2">
          Your Personalized Plan
        </h1>
        <p className="text-sm md:text-base text-(--font-color)/60">
          7-day customized program
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6 md:mb-10">
        <div className="flex gap-2">
          <TabButton tabName="workout" icon={Dumbbell} label="Workout" />
          <TabButton tabName="diet" icon={Utensils} label="Diet" />
          <TabButton tabName="tips" icon={Lightbulb} label="Tips" />
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-green-600 text-white hover:bg-green-700 shadow-md active:scale-95"
        >
          <Download size={18} />
          <span className="text-sm md:text-base">Export PDF</span>
        </button>
      </div>

      {/* Hidden printable content */}
      <div className="hidden">
        <div ref={componentRef}>
          <h1>Your Personalized Fitness Plan</h1>
          
          <h2>Workout Plan</h2>
          {plan.workoutPlan.map((day) => (
            <div key={day.day} className="day-section">
              <h3>Day {day.day}: {day.dayTitle}</h3>
              {day.exercises.length === 0 || day.dayTitle.toLowerCase().includes('rest') ? (
                <p>Rest & Recovery</p>
              ) : (
                day.exercises.map((ex, i) => (
                  <div key={i} className="exercise-item">
                    <div>{ex.name}</div>
                    <div className="exercise-details">
                      {ex.sets && `${ex.sets} sets`} {ex.reps && `× ${ex.reps}`} {ex.duration && ex.duration}
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
          
          <h2>Diet Plan</h2>
          {plan.dietPlan.map((day) => (
            <div key={day.day} className="day-section">
              <h3>Day {day.day}</h3>
              {Object.entries(day.meals).map(([mealType, meal]) => (
                <div key={mealType} className="meal-item">
                  <div className="meal-type">{mealType}</div>
                  <div>{meal}</div>
                </div>
              ))}
            </div>
          ))}
          
          <h2>Lifestyle Tips</h2>
          <ul className="tips-list">
            {plan.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Content Area */}
      <div className="animate-fade-in">
        {/* WORKOUT PLAN */}
        {activeTab === 'workout' && (
          <div className="space-y-3">
            {plan.workoutPlan.map((day) => {
              const itemKey = `workout-${day.day}`;
              const isThisSpeaking = speakingItem === itemKey;
              return (
                <div key={day.day} className="bg-(--surface-color) rounded-lg shadow-md overflow-hidden">
                  <div className="w-full p-4 flex items-center justify-between">
                    <button
                      onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                      className="flex items-center gap-3"
                    >
                      <div className="shrink-0 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-(--accent-color) text-white text-sm md:text-base font-semibold">
                        {day.day}
                      </div>
                      <div className="text-left">
                        <h4 className="text-base md:text-lg font-semibold text-(--font-color)">
                          {day.dayTitle}
                        </h4>
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      {/* 5. ADDED Per-Day Play Button */}
                      <button
                        onClick={() => playAudio(getWorkoutDayText(day), itemKey)}
                        className="p-2 rounded-full hover:bg-(--background-color)"
                      >
                        {isThisSpeaking ? (
                          <StopCircle className="text-red-500" size={20} />
                        ) : (
                          <Play className="text-(--accent-color)" size={20} />
                        )}
                      </button>
                      <button onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}>
                        <ChevronRight 
                          className={`text-(--font-color)/40 transition-transform ${
                            expandedDay === day.day ? 'rotate-90' : ''
                          }`} 
                          size={20} 
                        />
                      </button>
                    </div>
                  </div>
                
                {expandedDay === day.day && (
                  <div className="px-4 pb-4 animate-expand">
                    {day.exercises.length === 0 || day.dayTitle.toLowerCase().includes('rest') ? (
                      <div className="py-6 text-center">
                        <p className="text-base text-(--font-color)/60">Rest & Recovery</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {day.exercises.map((ex, i) => (
                          <div
                            key={i}
                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 rounded-lg bg-(--background-color)/50"
                          >
                            <button
                              onClick={() => generateImage(ex.name, 'exercise')}
                              className="text-left text-sm md:text-base text-(--font-color) active:text-(--accent-color)"
                            >
                              {ex.name}
                            </button>
                            <div className="text-xs md:text-sm text-(--font-color)/60 flex items-center gap-2">
                              {ex.sets && <span>{ex.sets} sets</span>}
                              {ex.reps && <span>× {ex.reps}</span>}
                              {ex.duration && <span>{ex.duration}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}

        {/* DIET PLAN */}
        {activeTab === 'diet' && (
          <div className="space-y-3">
            {plan.dietPlan.map((day) => {
              const itemKey = `diet-${day.day}`;
              const isThisSpeaking = speakingItem === itemKey;
              return (
                <div key={day.day} className="bg-(--surface-color) rounded-lg shadow-md overflow-hidden">
                  <div className="w-full p-4 flex items-center justify-between">
                    <button
                      onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                      className="flex items-center gap-3"
                    >
                      <div className="shrink-0 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-(--accent-color) text-white text-sm md:text-base font-semibold">
                        {day.day}
                      </div>
                      <h4 className="text-base md:text-lg font-semibold text-(--font-color)">
                        Day {day.day} Meals
                      </h4>
                    </button>
                    <div className="flex items-center gap-2">
                      {/* 5. ADDED Per-Day Play Button */}
                      <button
                        onClick={() => playAudio(getDietDayText(day), itemKey)}
                        className="p-2 rounded-full hover:bg-(--background-color)"
                      >
                        {isThisSpeaking ? (
                          <StopCircle className="text-red-500" size={20} />
                        ) : (
                          <Play className="text-(--accent-color)" size={20} />
                        )}
                      </button>
                      <button onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}>
                        <ChevronRight 
                          className={`text-(--font-color)/40 transition-transform ${
                            expandedDay === day.day ? 'rotate-90' : ''
                          }`} 
                          size={20} 
                        />
                      </button>
                    </div>
                  </div>
                
                {expandedDay === day.day && (
                  <div className="px-4 pb-4 animate-expand">
                    <div className="space-y-2">
                      {Object.entries(day.meals).map(([mealType, meal]) => (
                        <div
                          key={mealType}
                          className="p-3 rounded-lg bg-(--background-color)/50"
                        >
                          <span className="block text-xs text-(--font-color)/50 uppercase mb-1">
                            {mealType}
                          </span>
                          <button
                            onClick={() => generateImage(meal, 'food')}
                            className="text-left text-sm md:text-base text-(--font-color) active:text-(--accent-color) w-full"
                          >
                            {meal}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}

        {/* TIPS */}
        {activeTab === 'tips' && (
          <div className="space-y-4">
            <div className="bg-(--surface-color) p-5 md:p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="text-(--accent-color)" size={20} />
                  <h3 className="text-lg md:text-xl font-semibold text-(--font-color)">
                    Lifestyle Tips
                  </h3>
                </div>
                {/* 5. ADDED Per-Section Play Button */}
                <button
                  onClick={() => playAudio(plan.tips.join('... '), 'tips')}
                  className="p-2 rounded-full hover:bg-(--background-color)"
                >
                  {speakingItem === 'tips' ? (
                    <StopCircle className="text-red-500" size={20} />
                  ) : (
                    <Play className="text-(--accent-color)" size={20} />
                  )}
                </button>
              </div>
              <ul className="list-disc list-inside space-y-2 text-(--font-color)/90">
                {plan.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isLoadingImage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
      )}
      
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/30 p-2 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} />
          </button>
          <img
            src={selectedImage}
            alt="Generated visual"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes expand {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 2000px; }
        }
        
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-expand { animation: expand 0.3s ease-out; }
      `}</style>
    </div>
  );
}