import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";
import projectMobileUx from "@/assets/project-mobile-ux.jpg";
import projectDashboard from "@/assets/project-dashboard.jpg";
import projectEcommerce from "@/assets/project-ecommerce.jpg";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";

const Index = () => {
  const projects = [
    {
      title: "Mobile App Experience",
      description: "A comprehensive user journey mapping for a fintech mobile application, focusing on seamless onboarding and transaction flows.",
      category: "Mobile UX",
      image: projectMobileUx,
    },
    {
      title: "Analytics Dashboard",
      description: "Modern dashboard design system with intuitive data visualization and user-centered interface components.",
      category: "Web Design",
      image: projectDashboard,
    },
    {
      title: "E-commerce Journey",
      description: "End-to-end customer journey mapping from discovery to purchase, identifying key touchpoints and pain points.",
      category: "User Journey",
      image: projectEcommerce,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img 
            src={heroImage} 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Design Excellence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Designs & User Journeys
              <span className="block text-primary mt-2">Crafted with Purpose</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore beautifully crafted user experiences and design systems that put people first. 
              Every journey tells a story.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button size="lg" variant="default" className="group">
                View Projects
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 rounded-xl bg-card border border-border hover:shadow-medium transition-smooth">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Fast & Intuitive</h3>
              <p className="text-muted-foreground">
                Streamlined workflows that reduce friction and enhance user satisfaction at every touchpoint.
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6 rounded-xl bg-card border border-border hover:shadow-medium transition-smooth">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">User-Centered</h3>
              <p className="text-muted-foreground">
                Designs rooted in research, empathy, and real user needs. Every decision is intentional.
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6 rounded-xl bg-card border border-border hover:shadow-medium transition-smooth">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Beautifully Crafted</h3>
              <p className="text-muted-foreground">
                Attention to detail in every pixel, creating experiences that are both functional and delightful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Featured Work</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A showcase of recent design systems and user journey maps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-hero">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
            Ready to Transform Your User Experience?
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Let's collaborate to create meaningful journeys that your users will love.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button size="lg" variant="accent">
              Start a Project
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
              View Case Studies
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg"></div>
              <span className="text-lg font-semibold text-foreground">Journey</span>
            </div>
            <p className="text-muted-foreground">
              © 2024 Journey. Crafted with care for designers and users.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
