'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function DailyQuote() {
  const [quote, setQuote] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchQuote() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/get-quote');
        if (!response.ok) {
          throw new Error('Failed to fetch quote');
        }
        const data = await response.json();
        setQuote(data.quote);
      } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote("The only bad workout is the one that didn't happen.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuote();
  }, []);

  return (
    <div className="bg-(--surface-color) p-5 md:p-6 rounded-lg shadow-md mb-6 md:mb-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-(--accent-color)" size={20} />
        <h3 className="text-lg md:text-xl font-semibold text-(--font-color)">
          Daily Motivation
        </h3>
      </div>
      
      {isLoading ? (
        <div className="flex items-center gap-2 text-(--font-color)/70">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Fetching your daily inspiration...</span>
        </div>
      ) : (
        <blockquote className="text-base md:text-lg italic text-(--font-color)/90 border-l-4 border-(--accent-color) pl-4">
          "{quote}"
        </blockquote>
      )}
    </div>
  );
}