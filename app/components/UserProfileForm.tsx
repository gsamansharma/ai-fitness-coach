'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Activity, Target, Heart, Loader2 } from 'lucide-react';
import { UserProfileData } from '@/app/types';

export default function UserProfileForm() {
  const [formData, setFormData] = useState<UserProfileData>({
    name: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    fitnessGoal: 'maintenance',
    fitnessLevel: 'beginner',
    workoutLocation: 'gym',
    dietaryPreference: 'veg',
    medicalHistory: '',
    stressLevel: 'medium',
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); 
    setError(null);      

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan. Please try again.');
      }

      const result = await response.json();

      if (result.planId) {
        router.push(`/p/${result.planId}`);
      } else {
        throw new Error('API did not return a planId.');
      }
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { title: 'Personal', icon: User },
    { title: 'Metrics', icon: Activity },
    { title: 'Goals', icon: Target },
    { title: 'Preferences', icon: Heart },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-(--background-color) flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-(--accent-color) mb-2">
            Your Wellness Journey
          </h1>
          <p className="text-(--font-color)/80 text-sm md:text-base">
            Create a personalized plan tailored to your goals
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 px-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                  transition-all duration-300 mb-2
                  ${isActive ? 'bg-(--accent-color) text-(--background-color) scale-110 shadow-lg' : ''}
                  ${isCompleted ? 'bg-(--accent-color)/80 text-(--background-color)' : ''}
                  ${!isActive && !isCompleted ? 'bg-(--font-color)/20 text-(--font-color)/50' : ''}
                `}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className={`text-xs md:text-sm font-medium ${isActive ? 'text-(--accent-color)' : 'text-(--font-color)/50'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="bg-(--surface-color) rounded-2xl shadow-xl p-6 md:p-8 transition-colors duration-300">
          <div className="mb-6">
            <div className="h-1 bg-(--font-color)/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-(--accent-color) transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Step 0: Personal Info */}
            {currentStep === 0 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-(--font-color)/90 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border text-(--font-color) bg-(--background-color) border-(--font-color)/30 focus:ring-2 focus:ring-(--accent-color) focus:border-transparent transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-(--font-color)/90 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border text-(--font-color) bg-(--background-color) border-(--font-color)/30 focus:ring-2 focus:ring-(--accent-color) focus:border-transparent transition-all"
                      placeholder="25"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-(--font-color)/90 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border text-(--font-color) bg-(--background-color) border-(--font-color)/30 focus:ring-2 focus:ring-(--accent-color) focus:border-transparent transition-all"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Physical Metrics */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-(--font-color)/90 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-(--font-color)/30 text-(--font-color) bg-(--background-color) focus:ring-2 focus:ring-(--accent-color) focus:border-transparent transition-all"
                      placeholder="170"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-(--font-color)/90 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-(--font-color)/30 text-(--font-color) bg-(--background-color) focus:ring-2 focus:ring-(--accent-color) focus:border-transparent transition-all"
                      placeholder="70"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-(--font-color)/90 mb-2">
                    Medical History (Optional)
                  </label>
                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-(--font-color)/30 text-(--font-color) bg-(--background-color) focus:ring-2 focus:ring-(--accent-color) focus:border-transparent transition-all"
                    placeholder="Any health conditions we should know about?"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Fitness Goals */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-(--font-color)/90 mb-3">
                    Fitness Goal
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'weight_loss', label: 'Weight Loss', emoji: '🔥' },
                      { value: 'muscle_gain', label: 'Muscle Gain', emoji: '💪' },
                      { value: 'maintenance', label: 'Maintenance', emoji: '⚖️' },
                      { value: 'endurance', label: 'Endurance', emoji: '🏃' },
                    ].map((goal) => (
                      <button
                        key={goal.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, fitnessGoal: goal.value })}
                        className={`
                          p-4 rounded-lg border-2 transition-all text-left truncate overflow-hidden
                          ${formData.fitnessGoal === goal.value
                            ? 'border-(--accent-color) bg-(--accent-color)/10'
                            : 'border-(--font-color)/30 hover:border-(--font-color)/50'
                          }
                        `}
                      >
                        <div className="text-2xl mb-1">{goal.emoji}</div>
                        <div className="text-sm font-medium text-(--font-color)/90">{goal.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-(--font-color)/90 mb-3">
                    Current Fitness Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['beginner', 'intermediate', 'advanced'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData({ ...formData, fitnessLevel: level })}
                        className={`
                          p-3 rounded-lg border-2 transition-all capitalize truncate overflow-hidden
                          ${formData.fitnessLevel === level
                            ? 'border-(--accent-color) bg-(--accent-color)/10 text-(--accent-color)'
                            : 'border-(--font-color)/30 hover:border-(--font-color)/50 text-(--font-color)/90'
                          }
                        `}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-(--font-color)/90 mb-3">
                    Stress Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['low', 'medium', 'high'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData({ ...formData, stressLevel: level })}
                        className={`
                          p-3 rounded-lg border-2 transition-all capitalize truncate overflow-hidden
                          ${formData.stressLevel === level
                            ? 'border-(--accent-color) bg-(--accent-color)/10 text-(--accent-color)'
                            : 'border-(--font-color)/30 hover:border-(--font-color)/50 text-(--font-color)/90'
                          }
                        `}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-(--font-color)/90 mb-3">
                    Workout Location
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'gym', label: 'Gym', icon: '🏋️' },
                      { value: 'home', label: 'Home', icon: '🏠' },
                      { value: 'outdoor', label: 'Outdoor', icon: '🌳' },
                      { value: 'hybrid', label: 'Hybrid', icon: '🔄' },
                    ].map((location) => (
                      <button
                        key={location.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, workoutLocation: location.value })}
                        className={`
                          p-4 rounded-lg border-2 transition-all text-left
                          ${formData.workoutLocation === location.value
                            ? 'border-(--accent-color) bg-(--accent-color)/10'
                            : 'border-(--font-color)/30 hover:border-(--font-color)/50'
                          }
                        `}
                      >
                        <div className="text-2xl mb-1">{location.icon}</div>
                        <div className="text-sm font-medium text-(--font-color)/90">{location.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-(--font-color)/90 mb-3">
                    Dietary Preference
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'veg', label: 'Vegetarian', icon: '🥗' },
                      { value: 'non_veg', label: 'Non-Veg', icon: '🍗' },
                      { value: 'vegan', label: 'Vegan', icon: '🌱' },
                      { value: 'keto', label: 'Keto', icon: '🥑' },
                    ].map((diet) => (
                      <button
                        key={diet.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, dietaryPreference: diet.value })}
                        className={`
                          p-4 rounded-lg border-2 transition-all
                          ${formData.dietaryPreference === diet.value
                            ? 'border-(--accent-color) bg-(--accent-color)/10'
                            : 'border-(--font-color)/30 hover:border-(--font-color)/50'
                          }
                        `}
                      >
                        <div className="text-2xl mb-1">{diet.icon}</div>
                        <div className="text-xs font-medium text-(--font-color)/90">{diet.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 px-6 py-3 rounded-lg border-2 border-(--font-color)/30 text-(--font-color)/90 font-medium hover:bg-(--font-color)/10 transition-all"
              >
                Back
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 px-6 py-3 rounded-lg bg-(--accent-color) text-(--background-color) font-medium hover:opacity-90 transition-all shadow-lg"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-lg bg-(--accent-color) text-(--background-color) font-medium hover:opacity-90 transition-all shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate My Plan'
                )}
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}