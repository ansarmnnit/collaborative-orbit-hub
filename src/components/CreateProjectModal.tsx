
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

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

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

export const CreateProjectModal = ({ open, onClose, onProjectCreated }: CreateProjectModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'team' | 'public'>('team');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Create project in Supabase
      const newProject: Project = {
        id: Date.now().toString(),
        title,
        description,
        visibility,
        created_by: 'current_user',
        member_count: 1,
        task_count: 0,
        completed_tasks: 0
      };
      
      onProjectCreated(newProject);
      setTitle('');
      setDescription('');
      setVisibility('team');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Set up a new project to start organizing your tasks and collaborating with your team.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project"
                rows={3}
              />
            </div>
            
            <div className="grid gap-3">
              <Label>Visibility</Label>
              <RadioGroup value={visibility} onValueChange={(value: 'private' | 'team' | 'public') => setVisibility(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="flex-1">
                    <div className="font-medium">Private</div>
                    <div className="text-sm text-muted-foreground">Only you can access this project</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="team" id="team" />
                  <Label htmlFor="team" className="flex-1">
                    <div className="font-medium">Team</div>
                    <div className="text-sm text-muted-foreground">Accessible to team members only</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="flex-1">
                    <div className="font-medium">Public</div>
                    <div className="text-sm text-muted-foreground">Anyone can view this project</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
