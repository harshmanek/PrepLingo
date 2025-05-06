import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50 pt-28 pb-16 md:pt-32 md:pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-10 md:mb-0 animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-duo-dark mb-6 leading-tight">
              Learn a language <span className="text-duo-green">for free</span>,{" "}
              <span className="text-duo-blue">forever</span>.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
              Fun, effective learning that works. Join over 500 million learners mastering new languages the fun way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="duo-btn text-lg py-6 px-8">
                Get Started
              </Button>
              <Button variant="outline" className="text-lg py-6 px-8 font-bold">
                I Already Have An Account
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-[280px] h-[300px] md:w-[350px] md:h-[400px]">
              {/* Placeholder for owl character */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-64 md:w-72 md:h-72 bg-duo-green rounded-full opacity-10"></div>
              <div className="character-entrance absolute bottom-0 w-60 h-60 md:w-80 md:h-80">
                {/* Placeholder for character image - will be replaced with actual vector */}
                <div className="w-full h-full bg-duo-light-green rounded-full flex items-center justify-center animate-bounce-slight">
                  <span className="text-white text-6xl font-bold">Owl</span>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-10 right-0 w-20 h-20 bg-duo-yellow rounded-full opacity-70 animate-float"></div>
              <div className="absolute top-32 left-0 w-16 h-16 bg-duo-purple rounded-full opacity-60 animate-float" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-20 right-0 w-14 h-14 bg-duo-blue rounded-full opacity-60 animate-float" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
