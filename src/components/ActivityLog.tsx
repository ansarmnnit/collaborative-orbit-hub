
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MessageSquare, CheckCircle, Plus, User } from 'lucide-react';

interface ActivityItem {
  id: string;
  action_type: 'task_created' | 'task_updated' | 'comment_added' | 'status_changed' | 'project_created';
  performed_by: string;
  project_name: string;
  task_name?: string;
  description: string;
  created_at: string;
}

export const ActivityLog = () => {
  // Mock data - will be replaced with Supabase data
  const activities: ActivityItem[] = [
    {
      id: '1',
      action_type: 'task_created',
      performed_by: 'John Doe',
      project_name: 'Website Redesign',
      task_name: 'Update homepage layout',
      description: 'Created new task for homepage redesign',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      action_type: 'status_changed',
      performed_by: 'Jane Smith',
      project_name: 'Mobile App Development',
      task_name: 'API Integration',
      description: 'Changed status from In Progress to Completed',
      created_at: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      action_type: 'comment_added',
      performed_by: 'Mike Johnson',
      project_name: 'Website Redesign',
      task_name: 'Design review',
      description: 'Added comment with feedback on design mockups',
      created_at: '2024-01-14T16:45:00Z'
    },
    {
      id: '4',
      action_type: 'project_created',
      performed_by: 'Sarah Wilson',
      project_name: 'E-commerce Platform',
      description: 'Created new project for e-commerce development',
      created_at: '2024-01-14T14:20:00Z'
    }
  ];

  const getActivityIcon = (action_type: string) => {
    switch (action_type) {
      case 'task_created': return <Plus className="h-4 w-4" />;
      case 'task_updated': return <Calendar className="h-4 w-4" />;
      case 'comment_added': return <MessageSquare className="h-4 w-4" />;
      case 'status_changed': return <CheckCircle className="h-4 w-4" />;
      case 'project_created': return <User className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getActivityColor = (action_type: string) => {
    switch (action_type) {
      case 'task_created': return 'bg-blue-100 text-blue-800';
      case 'task_updated': return 'bg-yellow-100 text-yellow-800';
      case 'comment_added': return 'bg-purple-100 text-purple-800';
      case 'status_changed': return 'bg-green-100 text-green-800';
      case 'project_created': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Recent Activity</h2>
        <p className="text-muted-foreground">Stay updated with all project activities</p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src="" alt={activity.performed_by} />
                  <AvatarFallback className="text-xs">
                    {activity.performed_by.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{activity.performed_by}</span>
                    <Badge className={`${getActivityColor(activity.action_type)} px-2 py-0.5 text-xs flex items-center gap-1`}>
                      {getActivityIcon(activity.action_type)}
                      {activity.action_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="font-medium">{activity.project_name}</span>
                    {activity.task_name && (
                      <>
                        <span>•</span>
                        <span>{activity.task_name}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{formatDate(activity.created_at)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
