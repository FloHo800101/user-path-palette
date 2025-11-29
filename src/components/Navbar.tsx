import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg"></div>
            <span className="text-xl font-semibold text-foreground">Journey</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#projects" className="text-foreground hover:text-primary transition-smooth">
              Projects
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-smooth">
              About
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-smooth">
              Contact
            </a>
          </div>
          
          <Button variant="accent">Get Started</Button>
        </div>
      </div>
    </nav>
  );
};
