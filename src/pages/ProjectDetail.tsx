
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Users, Settings } from 'lucide-react';
import { TaskBoard } from '@/components/TaskBoard';
import { ProjectMembers } from '@/components/ProjectMembers';
import { CreateTaskModal } from '@/components/CreateTaskModal';

interface Project {
  id: string;
  title: string;
  description: string;
  visibility: 'private' | 'team' | 'public';
  created_by: string;
  member_count: number;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    // TODO: Fetch project from Supabase
    const mockProject: Project = {
      id: id || '1',
      title: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design and improved user experience',
      visibility: 'team',
      created_by: 'user1',
      member_count: 5
    };
    setProject(mockProject);
  }, [id]);

  if (!project) {
    return <div>Loading...</div>;
  }

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'private': return 'bg-red-100 text-red-800';
      case 'team': return 'bg-blue-100 text-blue-800';
      case 'public': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{project.title}</h1>
                <Badge className={getVisibilityColor(project.visibility)}>
                  {project.visibility}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">{project.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{project.member_count} members</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button onClick={() => setShowCreateTask(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="mt-6">
            <TaskBoard projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="members" className="mt-6">
            <ProjectMembers projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="activity" className="mt-6">
            <div className="text-center py-8 text-muted-foreground">
              Project activity log will be displayed here
            </div>
          </TabsContent>
        </Tabs>

        <CreateTaskModal 
          open={showCreateTask}
          onClose={() => setShowCreateTask(false)}
          projectId={project.id}
          onTaskCreated={() => {
            setShowCreateTask(false);
            // TODO: Refresh tasks
          }}
        />
      </div>
    </div>
  );
};

export default ProjectDetail;
