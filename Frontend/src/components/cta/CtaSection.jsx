import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Dummy language options
const languages = [
  { id: 1, name: 'Spanish', flag: '🇪🇸' },
  { id: 2, name: 'French', flag: '🇫🇷' },
  { id: 3, name: 'Japanese', flag: '🇯🇵' },
  { id: 4, name: 'German', flag: '🇩🇪' },
  { id: 5, name: 'Korean', flag: '🇰🇷' },
  { id: 6, name: 'Italian', flag: '🇮🇹' },
];

const CtaSection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  return (
    <section className="duo-section bg-duo-green/10">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to start your language journey?</h2>
              <p className="text-gray-600 mb-6">
                Choose a language and start learning today with just 5 minutes a day.
              </p>
              
              <div className="mb-6">
                <h3 className="font-bold mb-3">I want to learn...</h3>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map(language => (
                    <Button
                      key={language.id}
                      variant={selectedLanguage === language.id ? "default" : "outline"}
                      className={`justify-start ${
                        selectedLanguage === language.id 
                          ? "bg-duo-green hover:bg-duo-green text-white"
                          : "hover:border-duo-green hover:text-duo-green"
                      }`}
                      onClick={() => setSelectedLanguage(language.id)}
                    >
                      <span className="mr-2">{language.flag}</span>
                      {language.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full duo-btn flex items-center justify-center text-lg"
                disabled={selectedLanguage === null}
              >
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="w-full md:w-1/2 bg-duo-blue/10 p-8 md:p-12 flex items-center justify-center">
              {/* Placeholder for CTA illustration */}
              <div className="w-48 h-48 bg-duo-green rounded-full flex items-center justify-center animate-float">
                <span className="text-white text-5xl">🎯</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
