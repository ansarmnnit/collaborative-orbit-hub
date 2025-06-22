
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, UserPlus } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'developer' | 'user';
  role_in_project: string;
  joined_at: string;
}

interface ProjectMembersProps {
  projectId: string;
}

export const ProjectMembers = ({ projectId }: ProjectMembersProps) => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    // TODO: Fetch members from Supabase
    const mockMembers: Member[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'manager',
        role_in_project: 'Project Manager',
        joined_at: '2024-01-10T00:00:00Z'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'developer',
        role_in_project: 'Frontend Developer',
        joined_at: '2024-01-12T00:00:00Z'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'developer',
        role_in_project: 'Backend Developer',
        joined_at: '2024-01-15T00:00:00Z'
      }
    ];
    setMembers(mockMembers);
  }, [projectId]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'developer': return 'bg-green-100 text-green-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Project Members ({members.length})</h3>
        <Button size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid gap-4">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="" alt={member.name} />
                  <AvatarFallback>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                  <p className="text-sm text-muted-foreground">{member.role_in_project}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getRoleColor(member.role)}>
                  {member.role}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Joined {formatDate(member.joined_at)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
