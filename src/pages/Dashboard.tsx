
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Calendar, Activity } from 'lucide-react';
import { ProjectCard } from '@/components/ProjectCard';
import { CreateProjectModal } from '@/components/CreateProjectModal';
import { ActivityLog } from '@/components/ActivityLog';

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

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'activity'>('projects');

  // Mock data for now - will be replaced with Supabase data
  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Complete overhaul of company website',
      visibility: 'team',
      created_by: 'user1',
      member_count: 5,
      task_count: 12,
      completed_tasks: 8
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'Native mobile application for iOS and Android',
      visibility: 'private',
      created_by: 'user1',
      member_count: 3,
      task_count: 25,
      completed_tasks: 10
    }
  ];

  useEffect(() => {
    // TODO: Fetch projects from Supabase
    setProjects(mockProjects);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Project Dashboard</h1>
          <p className="text-muted-foreground">Manage your projects and track progress</p>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'projects' ? 'default' : 'outline'}
            onClick={() => setActiveTab('projects')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Projects
          </Button>
          <Button
            variant={activeTab === 'activity' ? 'default' : 'outline'}
            onClick={() => setActiveTab('activity')}
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Activity
          </Button>
        </div>

        {activeTab === 'projects' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{projects.length}</div>
                    <div className="text-sm text-muted-foreground">Total Projects</div>
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">
                      {projects.reduce((sum, p) => sum + p.task_count, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Tasks</div>
                  </CardContent>
                </Card>
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">
                      {projects.reduce((sum, p) => sum + p.completed_tasks, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </CardContent>
                </Card>
              </div>
              <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        ) : (
          <ActivityLog />
        )}

        <CreateProjectModal 
          open={showCreateModal} 
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={(project) => {
            setProjects([...projects, project]);
            setShowCreateModal(false);
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
