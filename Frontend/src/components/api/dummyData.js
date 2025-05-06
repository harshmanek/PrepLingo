// Language example:
// {
//   id: number,
//   name: string,
//   nativeName: string,
//   flag: string,
//   lessons: number,
//   users: string,
//   difficulty: 'easy' | 'medium' | 'hard',
//   timeToLearn: string,
//   categories: string[]
// }

// Testimonial example:
// {
//   id: number,
//   name: string,
//   language: string,
//   rating: number,
//   text: string,
//   avatar: string,
//   location?: string,
//   date?: string
// }

// Feature example:
// {
//   id: number,
//   title: string,
//   description: string,
//   icon: string,
//   color: string
// }

// Dummy data for languages
export const languages = [
    {
      id: 1,
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      lessons: 148,
      users: '34M',
      difficulty: 'easy',
      timeToLearn: '15 weeks',
      categories: ['Romance', 'Popular', 'European']
    },
    {
      id: 2,
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      lessons: 124,
      users: '26M',
      difficulty: 'medium',
      timeToLearn: '18 weeks',
      categories: ['Romance', 'Popular', 'European']
    },
    {
      id: 3,
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
      lessons: 164,
      users: '22M',
      difficulty: 'hard',
      timeToLearn: '38 weeks',
      categories: ['Asian', 'Popular']
    },
    {
      id: 4,
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      lessons: 132,
      users: '19M',
      difficulty: 'medium',
      timeToLearn: '24 weeks',
      categories: ['Germanic', 'European']
    },
    {
      id: 5,
      name: 'Korean',
      nativeName: '한국어',
      flag: '🇰🇷',
      lessons: 118,
      users: '15M',
      difficulty: 'hard',
      timeToLearn: '36 weeks',
      categories: ['Asian', 'Trending']
    },
    {
      id: 6,
      name: 'Italian',
      nativeName: 'Italiano',
      flag: '🇮🇹',
      lessons: 106,
      users: '12M',
      difficulty: 'easy',
      timeToLearn: '16 weeks',
      categories: ['Romance', 'European']
    }
  ];
  
  // Dummy data for testimonials
  export const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      language: "Spanish",
      rating: 5,
      text: "LinguaVerse made learning Spanish fun and easy. I went from zero knowledge to having conversations with locals during my trip to Madrid!",
      avatar: "SJ",
      location: "New York, USA",
      date: "2025-03-15"
    },
    {
      id: 2,
      name: "David Kim",
      language: "Japanese",
      rating: 5,
      text: "The gamification elements kept me motivated. After 6 months of daily practice, I can now watch anime without subtitles!",
      avatar: "DK",
      location: "Toronto, Canada",
      date: "2025-02-27"
    },
    {
      id: 3,
      name: "Michelle Patel",
      language: "French",
      rating: 4,
      text: "As a busy professional, the short lessons fit perfectly into my schedule. Now I can confidently speak French with my international colleagues.",
      avatar: "MP",
      location: "London, UK",
      date: "2025-04-02"
    },
    {
      id: 4,
      name: "Thomas Müller",
      language: "Italian",
      rating: 5,
      text: "I've tried many language apps, and LinguaVerse is by far the most effective. The spaced repetition system works wonders for retention!",
      avatar: "TM",
      location: "Berlin, Germany",
      date: "2025-03-21"
    }
  ];
  
  // Dummy data for features
  export const features = [
    {
      id: 1,
      title: "Bite-sized lessons",
      description: "Quick 5-minute lessons designed to fit your busy schedule, making it easy to practice every day",
      icon: "📚",
      color: "bg-duo-green"
    },
    {
      id: 2,
      title: "Personalized learning",
      description: "Our AI-powered system adapts to your learning style and pace to optimize your progress",
      icon: "🤖",
      color: "bg-duo-blue"
    },
    {
      id: 3,
      title: "Fun game-like experience",
      description: "Earn points, unlock achievements, and stay motivated with interactive challenges",
      icon: "🎮",
      color: "bg-duo-purple"
    },
    {
      id: 4,
      title: "Proven effectiveness",
      description: "Scientific approach to language learning based on spaced repetition and immersion",
      icon: "📊",
      color: "bg-duo-orange"
    }
  ];
  
  // User progress data
  export const userProgress = {
    streak: 7,
    currentXP: 35,
    dailyGoal: 50,
    totalXP: 1240,
    fluencyScore: 28,
    completedLessons: 42,
    wordsLearned: 315,
    nextMilestone: {
      name: "Conversational",
      pointsNeeded: 250
    },
    recentActivity: [
      {
        date: "2025-05-05",
        activity: "Completed Greetings lesson",
        xpEarned: 15
      },
      {
        date: "2025-05-04",
        activity: "Practiced Past Tense",
        xpEarned: 20
      },
      {
        date: "2025-05-03",
        activity: "Learned 10 new words",
        xpEarned: 10
      }
    ]
  };
  