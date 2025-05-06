import React from 'react';

const steps = [
  {
    id: 1,
    title: "Choose your language",
    description: "Select from over 40 languages with courses designed by language experts",
    color: "bg-duo-blue"
  },
  {
    id: 2,
    title: "Set your daily goal",
    description: "Choose how much time you want to practice each day to stay on track",
    color: "bg-duo-purple"
  },
  {
    id: 3,
    title: "Learn with fun lessons",
    description: "Complete bite-sized lessons with speaking, listening, and interactive exercises",
    color: "bg-duo-green"
  },
  {
    id: 4,
    title: "Track your progress",
    description: "Earn points, unlock achievements, and watch your fluency grow",
    color: "bg-duo-orange"
  }
];

const HowItWorksSection = () => {
  return (
    <section className="duo-section bg-white">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How LinguaVerse Works</h2>
          <p className="text-lg text-gray-600">
            Our proven method makes language learning effective and enjoyable
          </p>
        </div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-32 left-1/2 w-0.5 h-[calc(100%-150px)] bg-gray-200 transform -translate-x-1/2 hidden lg:block"></div>
          
          <div className="space-y-16 lg:space-y-0">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col lg:flex-row items-center">
                <div className={`w-full lg:w-1/2 ${index % 2 === 1 ? 'lg:order-2' : ''} mb-6 lg:mb-0`}>
                  <div className="max-w-md mx-auto lg:mx-0">
                    <div className={`${step.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4`}>
                      {step.id}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                
                <div className={`w-full lg:w-1/2 ${index % 2 === 1 ? 'lg:order-1 lg:pr-8' : 'lg:pl-8'}`}>
                  {/* Placeholder for step illustrations */}
                  <div className={`rounded-xl w-full h-48 ${step.color}/30 flex items-center justify-center animate-float`}>
                    <span className="text-lg font-semibold">{step.title} Illustration</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
