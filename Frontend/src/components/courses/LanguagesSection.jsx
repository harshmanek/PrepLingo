import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

// Dummy language data
const languages = [
  { id: 1, name: 'Spanish', lessons: 148, users: '34M', color: 'bg-duo-blue', icon: '🇪🇸' },
  { id: 2, name: 'French', lessons: 124, users: '26M', color: 'bg-duo-purple', icon: '🇫🇷' },
  { id: 3, name: 'Japanese', lessons: 164, users: '22M', color: 'bg-duo-red', icon: '🇯🇵' },
  { id: 4, name: 'German', lessons: 132, users: '19M', color: 'bg-duo-orange', icon: '🇩🇪' },
  { id: 5, name: 'Korean', lessons: 118, users: '15M', color: 'bg-duo-green', icon: '🇰🇷' },
  { id: 6, name: 'Italian', lessons: 106, users: '12M', color: 'bg-duo-yellow', icon: '🇮🇹' },
];

const LanguageCard = ({ language }) => {
  return (
    <Card className="hover-scale relative overflow-hidden border-2 border-gray-100 hover:border-duo-green transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className={`${language.color} text-white w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4`}>
              {language.icon}
            </div>
            <h3 className="text-xl font-bold mb-1">{language.name}</h3>
            <p className="text-sm text-gray-500">{language.lessons} lessons • {language.users} learners</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-duo-light hover:bg-duo-green flex items-center justify-center transition-colors duration-300 cursor-pointer group">
            <ArrowRight className="h-4 w-4 text-duo-green group-hover:text-white transition-colors duration-300" />
          </div>
        </div>
        <div className="mt-4 bg-gray-100 h-2 rounded-full overflow-hidden">
          <div className={`h-full ${language.color} w-0 animate-pulse-width`} style={{ width: `${Math.random() * 30 + 10}%` }}></div>
        </div>
        <p className="text-xs mt-2 text-gray-400">Start your journey!</p>
      </CardContent>
    </Card>
  );
};

const LanguagesSection = () => {
  return (
    <section className="duo-section bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Choose from 40+ languages
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Learn a new language with bite-sized lessons designed for real-world conversations
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map(language => (
            <LanguageCard key={language.id} language={language} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <button className="duo-btn inline-flex items-center">
            See all languages
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LanguagesSection;
