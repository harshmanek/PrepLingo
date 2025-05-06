import React from 'react';
import Navbar from './components/navbar/Navbar';
import HeroSection from './components/hero/HeroSection';
import LanguagesSection from './components/courses/LanguagesSection';
import FeaturesSection from './components/features/FeaturesSection';
import HowItWorksSection from './components/how-it-works/HowItWorksSection';
import GamificationSection from './components/gamification/GamificationSection';
import TestimonialsSection from './components/testimonials/TestimonialsSection';
import CtaSection from './components/cta/CtaSection';
import Footer from './components/footer/Footer';

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <LanguagesSection />
      <FeaturesSection />
      {/* <HowItWorksSection /> */}
      <GamificationSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default App;