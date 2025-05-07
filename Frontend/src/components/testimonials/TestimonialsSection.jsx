import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

// Dummy testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    language: "Spanish",
    rating: 5,
    text: "LinguaVerse made learning Spanish fun and easy. I went from zero knowledge to having conversations with locals during my trip to Madrid!",
    avatar: "SJ"
  },
  {
    id: 2,
    name: "David Kim",
    language: "Japanese",
    rating: 5,
    text: "The gamification elements kept me motivated. After 6 months of daily practice, I can now watch anime without subtitles!",
    avatar: "DK"
  },
  {
    id: 3,
    name: "Michelle Patel",
    language: "French",
    rating: 4,
    text: "As a busy professional, the short lessons fit perfectly into my schedule. Now I can confidently speak French with my international colleagues.",
    avatar: "MP"
  }
];

const TestimonialCard = ({ testimonial }) => {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-duo-purple/20 text-duo-purple flex items-center justify-center font-bold text-lg mr-3">
            {testimonial.avatar}
          </div>
          <div>
            <h4 className="font-bold">{testimonial.name}</h4>
            <p className="text-sm text-gray-500">Learning {testimonial.language}</p>
          </div>
        </div>
        
        <div className="flex mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < testimonial.rating ? 'text-duo-yellow fill-duo-yellow' : 'text-gray-300'}`} 
            />
          ))}
        </div>
        
        <p className="text-gray-700">"{testimonial.text}"</p>
      </CardContent>
    </Card>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="duo-section bg-duo-light">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success stories from our learners</h2>
          <p className="text-lg text-gray-600">
            Join millions who have achieved their language learning goals with LinguaVerse
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-block bg-white px-8 py-6 rounded-xl shadow-md">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-duo-green text-5xl font-bold">4.8</div>
              <div className="flex flex-col items-start">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-duo-yellow fill-duo-yellow" />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">Based on 250,000+ reviews</span>
              </div>
            </div>
            <p className="text-gray-700 font-medium">
              Join over 500 million happy language learners worldwide
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
