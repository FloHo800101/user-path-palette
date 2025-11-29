import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  image: string;
}

export const ProjectCard = ({ title, description, category, image }: ProjectCardProps) => {
  return (
    <Card className="group overflow-hidden border-border bg-gradient-card hover:shadow-strong transition-smooth cursor-pointer">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <Badge variant="secondary" className="mb-3">
          {category}
        </Badge>
        <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Card>
  );
};
