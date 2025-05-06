import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-duo-green rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-duo-green font-bold text-2xl">LinguaVerse</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-xs">
              Making language learning fun, effective, and accessible for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-duo-green hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <span>f</span>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-duo-green hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <span>t</span>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-duo-green hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <span>i</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Learn</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-duo-green">Languages</a></li>
              <li><a href="#" className="text-gray-600 hover:text-duo-green">Courses</a></li>
              <li><a href="#" className="text-gray-600 hover:text-duo-green">Learning Paths</a></li>
              <li><a href="#" className="text-gray-600 hover:text-duo-green">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-duo-green">Dictionary</a></li>
              <li><a href="#" className="text-gray-600 hover:text-duo-green">Phrase Book</a></li>
              <li><a href="#" className="text-gray-600 hover:text-duo-green">Stories</a></li>
              <li><a href="#" className="text-gray-600 hover:text-duo-green">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-duo-green">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-duo-green">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-duo-green">Contact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-duo-green">Help Center</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 LinguaVerse. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-duo-green text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-duo-green text-sm">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-duo-green text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
