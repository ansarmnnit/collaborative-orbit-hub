
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Calendar, MessageSquare } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Team Collaboration",
      description: "Work together with role-based access control and project visibility settings"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      title: "Task Management",
      description: "Create, assign, and track tasks with multiple assignees and status updates"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
      title: "Nested Comments",
      description: "Engage in detailed discussions with threaded comments on every task"
    },
    {
      icon: <Calendar className="h-8 w-8 text-orange-600" />,
      title: "Activity Tracking",
      description: "Keep track of all project activities and team member contributions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ProjectHub
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A comprehensive project management platform designed for modern teams. 
            Organize projects, manage tasks, and collaborate seamlessly.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 text-lg"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-3 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Role-Based Access</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Admin, Manager, Developer, and User roles</li>
                <li>• Project-specific permissions</li>
                <li>• Secure access control</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Project Management</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Private, Team, and Public visibility</li>
                <li>• Multi-member projects</li>
                <li>• Comprehensive task tracking</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Task System</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Multiple assignees per task</li>
                <li>• Status tracking and updates</li>
                <li>• Time-based scheduling</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Communication</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Nested comment threads</li>
                <li>• Real-time notifications</li>
                <li>• Activity logging</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of teams already using ProjectHub to manage their projects efficiently.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/dashboard')}
            className="px-12 py-4 text-lg"
          >
            Start Your First Project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
