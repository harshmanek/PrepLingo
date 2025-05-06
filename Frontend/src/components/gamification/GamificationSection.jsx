import React from 'react';
import { Trophy, Star, Award, BarChart } from 'lucide-react';

const GameElement = ({ icon, title, description, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const GamificationSection = () => {
  return (
    <section className="duo-section bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Keep motivated with gamification</h2>
          <p className="text-lg text-gray-600">
            Learn through a game-like experience that makes language acquisition fun and addictive
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GameElement 
            icon={<Trophy className="h-6 w-6 text-white" />}
            title="Leaderboards"
            description="Compete with friends and other learners to stay motivated and track your progress"
            color="bg-duo-yellow"
          />
          
          <GameElement 
            icon={<Star className="h-6 w-6 text-white" />}
            title="Streaks"
            description="Build daily learning habits and earn rewards for your consistency"
            color="bg-duo-orange"
          />
          
          <GameElement 
            icon={<Award className="h-6 w-6 text-white" />}
            title="Achievements"
            description="Earn badges and unlock achievements as you master new skills"
            color="bg-duo-blue"
          />
          
          <GameElement 
            icon={<BarChart className="h-6 w-6 text-white" />}
            title="Progress tracking"
            description="Watch your fluency score improve as you complete lessons and practice"
            color="bg-duo-green"
          />
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg max-w-2xl w-full">
            <div className="mb-6 text-center">
              <div className="inline-block bg-duo-yellow/20 text-duo-orange px-4 py-1 rounded-full text-sm font-semibold mb-3">
                Keep your streak alive!
              </div>
              <h3 className="text-2xl font-bold">You're on a 7-day streak!</h3>
            </div>
            
            {/* Streak calendar */}
            <div className="flex justify-between mb-8">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                    ${index < 6 ? 'bg-duo-green text-white' : 'bg-duo-light-green/20 text-duo-green border-2 border-dashed border-duo-green'}`}>
                    <span className="text-sm font-bold">{index < 6 ? '✓' : '?'}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="h-2 bg-gray-100 rounded-full mb-2">
              <div className="h-full bg-duo-green rounded-full" style={{ width: '70%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 XP</span>
              <span>Daily Goal: 20 XP</span>
              <span>50 XP</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamificationSection;
