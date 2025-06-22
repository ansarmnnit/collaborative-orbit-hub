
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Users, Calendar, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  description: string;
  visibility: 'private' | 'team' | 'public';
  created_by: string;
  member_count: number;
  task_count: number;
  completed_tasks: number;
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const progress = project.task_count > 0 ? (project.completed_tasks / project.task_count) * 100 : 0;

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'private': return 'bg-red-100 text-red-800';
      case 'team': return 'bg-blue-100 text-blue-800';
      case 'public': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{project.title}</CardTitle>
            <CardDescription className="text-sm">{project.description}</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge className={getVisibilityColor(project.visibility)}>
            {project.visibility}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.completed_tasks}/{project.task_count} tasks</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{project.member_count} members</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Updated 2 days ago</span>
            </div>
          </div>
          
          <Button 
            className="w-full mt-4" 
            onClick={() => navigate(`/project/${project.id}`)}
          >
            View Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
