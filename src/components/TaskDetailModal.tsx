
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MessageSquare, User } from 'lucide-react';

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

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  parent_comment_id?: string;
  replies?: Comment[];
}

interface TaskDetailModalProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  onTaskUpdated: (task: Task) => void;
}

export const TaskDetailModal = ({ task, open, onClose, onTaskUpdated }: TaskDetailModalProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [taskStatus, setTaskStatus] = useState(task.status);

  useEffect(() => {
    if (open) {
      // TODO: Fetch comments from Supabase
      const mockComments: Comment[] = [
        {
          id: '1',
          content: 'This looks great! I\'ve started working on the wireframes.',
          created_at: '2024-01-16T10:30:00Z',
          user: { id: '1', name: 'John Doe', email: 'john@example.com' }
        },
        {
          id: '2',
          content: 'Should we consider mobile-first approach for this design?',
          created_at: '2024-01-16T14:15:00Z',
          user: { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
        }
      ];
      setComments(mockComments);
    }
  }, [open, task.id]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleStatusChange = (newStatus: string) => {
    setTaskStatus(newStatus as Task['status']);
    // TODO: Update task status in Supabase
    const updatedTask = { ...task, status: newStatus as Task['status'] };
    onTaskUpdated(updatedTask);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // TODO: Add comment to Supabase
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      content: newComment,
      created_at: new Date().toISOString(),
      user: { id: 'current-user', name: 'Current User', email: 'user@example.com' }
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
            <Badge className={getStatusColor(taskStatus)}>
              {getStatusLabel(taskStatus)}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Task Details */}
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-muted-foreground">{task.description}</p>
          </div>
          
          {/* Status Update */}
          <div>
            <h4 className="font-medium mb-2">Status</h4>
            <Select value={taskStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Timeline */}
          {task.start_time && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(task.start_time).toLocaleDateString()} - {task.end_time ? new Date(task.end_time).toLocaleDateString() : 'No end date'}
              </span>
            </div>
          )}
          
          {/* Assignees */}
          <div>
            <h4 className="font-medium mb-2">Assignees</h4>
            <div className="flex gap-2">
              {task.assignees.map((assignee) => (
                <div key={assignee.id} className="flex items-center gap-2 text-sm">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="" alt={assignee.name} />
                    <AvatarFallback className="text-xs">
                      {assignee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{assignee.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Comments Section */}
          <div>
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments ({comments.length})
            </h4>
            
            {/* Add Comment */}
            <div className="space-y-2 mb-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
              />
              <Button onClick={handleAddComment} size="sm">
                Add Comment
              </Button>
            </div>
            
            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-l-2 border-muted pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="" alt={comment.user.name} />
                      <AvatarFallback className="text-xs">
                        {comment.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{comment.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
