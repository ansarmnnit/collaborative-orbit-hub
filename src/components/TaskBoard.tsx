
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, User } from 'lucide-react';
import { TaskDetailModal } from '@/components/TaskDetailModal';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  start_time?: string;
  end_time?: string;
  created_by: string;
  assignees: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  comment_count: number;
}

interface TaskBoardProps {
  projectId: string;
}

export const TaskBoard = ({ projectId }: TaskBoardProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    // TODO: Fetch tasks from Supabase
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Design Homepage Layout',
        description: 'Create wireframes and mockups for the new homepage design',
        status: 'in_progress',
        start_time: '2024-01-15T09:00:00Z',
        end_time: '2024-01-20T17:00:00Z',
        created_by: 'user1',
        assignees: [
          { id: '1', name: 'John Doe', email: 'john@example.com' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
        ],
        comment_count: 3
      },
      {
        id: '2',
        title: 'Implement User Authentication',
        description: 'Set up login/logout functionality with proper session management',
        status: 'not_started',
        start_time: '2024-01-22T09:00:00Z',
        end_time: '2024-01-25T17:00:00Z',
        created_by: 'user2',
        assignees: [
          { id: '3', name: 'Mike Johnson', email: 'mike@example.com' }
        ],
        comment_count: 1
      },
      {
        id: '3',
        title: 'Setup Database Schema',
        description: 'Create all necessary tables and relationships in the database',
        status: 'completed',
        start_time: '2024-01-10T09:00:00Z',
        end_time: '2024-01-12T17:00:00Z',
        created_by: 'user1',
        assignees: [
          { id: '1', name: 'John Doe', email: 'john@example.com' }
        ],
        comment_count: 5
      }
    ];
    setTasks(mockTasks);
  }, [projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not_started': return 'Not Started';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const groupedTasks = {
    not_started: tasks.filter(t => t.status === 'not_started'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed')
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupedTasks).map(([status, statusTasks]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                {getStatusLabel(status)} ({statusTasks.length})
              </h3>
            </div>
            
            <div className="space-y-3">
              {statusTasks.map((task) => (
                <Card 
                  key={task.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{task.title}</CardTitle>
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusLabel(task.status)}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {task.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {task.start_time && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(task.start_time)} - {formatDate(task.end_time)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {task.assignees.slice(0, 3).map((assignee) => (
                            <Avatar key={assignee.id} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src="" alt={assignee.name} />
                              <AvatarFallback className="text-xs">
                                {assignee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {task.assignees.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                              +{task.assignees.length - 3}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          <span>{task.comment_count}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask}
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={(updatedTask) => {
            setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
            setSelectedTask(updatedTask);
          }}
        />
      )}
    </div>
  );
};
