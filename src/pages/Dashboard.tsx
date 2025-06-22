
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Calendar, Activity, LogOut } from 'lucide-react';
import { ProjectCard } from '@/components/ProjectCard';
import { CreateProjectModal } from '@/components/CreateProjectModal';
import { ActivityLog } from '@/components/ActivityLog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'activity'>('projects');
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      // Fetch projects with member counts and task statistics
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          project_members!inner(count),
          tasks(id, status)
        `);

      if (projectsError) throw projectsError;

      const formattedProjects = projectsData?.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description || '',
        visibility: project.visibility,
        created_by: project.created_by,
        member_count: project.project_members?.length || 0,
        task_count: project.tasks?.length || 0,
        completed_tasks: project.tasks?.filter((task: any) => task.status === 'completed').length || 0
      })) || [];

      setProjects(formattedProjects);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Project Dashboard</h1>
            <p className="text-muted-foreground">Manage your projects and track progress</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.email}</span>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
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
            fetchProjects(); // Refresh to get accurate counts
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
