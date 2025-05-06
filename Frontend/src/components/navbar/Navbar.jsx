import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <div className="w-10 h-10 bg-duo-green rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-duo-green font-bold text-2xl">PrepLingo</span>
          </a>
          
          <div className="hidden md:flex ml-10 space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center text-base font-medium">
                  Learn <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem>Languages</DropdownMenuItem>
                <DropdownMenuItem>Courses</DropdownMenuItem>
                <DropdownMenuItem>Learning Path</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center text-base font-medium">
                  Resources <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem>Dictionary</DropdownMenuItem>
                <DropdownMenuItem>Phrase Book</DropdownMenuItem>
                <DropdownMenuItem>Stories</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" className="text-base font-medium">Pricing</Button>
            <Button variant="ghost" className="text-base font-medium">Community</Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden md:block font-semibold">Log in</Button>
          <Button className="bg-duo-green hover:bg-duo-light-green text-white font-semibold">Get Started</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
