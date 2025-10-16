import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const MovieCard = ({ id, title, description, duration, posterUrl, status }) => {
  return (
    <Link to={`/movie/${id}`} className="group">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card border-border">
        <div className="aspect-[2/3] overflow-hidden bg-muted relative">
          {posterUrl ? (
            <img 
              src={posterUrl} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <span className="text-6xl font-bold text-muted-foreground">{title[0]}</span>
            </div>
          )}
          {status === "coming_soon" && (
            <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground">
              Sắp Chiếu
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-1 text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{duration} phút</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};


