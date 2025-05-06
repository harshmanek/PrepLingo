import React from 'react';
import { CheckCircle } from 'lucide-react';

const features = [
  {
    id: 1,
    title: "Bite-sized lessons",
    description: "Quick 5-minute lessons designed to fit your busy schedule, making it easy to practice every day",
    color: "bg-duo-green"
  },
  {
    id: 2,
    title: "Personalized learning",
    description: "Our AI-powered system adapts to your learning style and pace to optimize your progress",
    color: "bg-duo-blue"
  },
  {
    id: 3,
    title: "Fun game-like experience",
    description: "Earn points, unlock achievements, and stay motivated with interactive challenges",
    color: "bg-duo-purple"
  },
  {
    id: 4,
    title: "Proven effectiveness",
    description: "Scientific approach to language learning based on spaced repetition and immersion",
    color: "bg-duo-orange"
  }
];

const FeatureCard = ({ feature }) => {
  return (
    <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center mb-4`}>
        <CheckCircle className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="duo-section bg-duo-light">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why millions choose LinguaVerse</h2>
          <p className="text-lg text-gray-600">
            We make learning fun and effective with methods backed by research and a community that keeps you motivated
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-scale-up">
          {features.map(feature => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
        
        <div className="mt-16 bg-white p-8 rounded-xl border border-gray-100 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h3 className="text-2xl font-bold mb-3">Track your progress</h3>
              <p className="text-gray-600 max-w-md">
                Set daily goals, earn streaks, and watch your fluency score improve as you master new skills
              </p>
            </div>
            
            <div className="w-full md:w-auto">
              {/* Placeholder for stats/progress chart */}
              <div className="w-full md:w-64 h-32 bg-gradient-to-r from-duo-green/20 to-duo-blue/20 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-duo-dark">Progress Chart</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
