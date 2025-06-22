
-- Create enums for various fields
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'developer', 'user');
CREATE TYPE project_visibility AS ENUM ('private', 'team', 'public');
CREATE TYPE task_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE action_type AS ENUM ('task_created', 'task_updated', 'task_assigned', 'comment_added', 'status_changed', 'project_created', 'member_added');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    visibility project_visibility NOT NULL DEFAULT 'private',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project members table
CREATE TABLE public.project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role_in_project TEXT NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Tasks table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    status task_status NOT NULL DEFAULT 'not_started',
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task assignees table
CREATE TABLE public.task_assignees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(task_id, user_id)
);

-- Comments table (with nested structure)
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Motivation/Activity logs table
CREATE TABLE public.motivation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type action_type NOT NULL,
    performed_by UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motivation_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for projects table
CREATE POLICY "Users can view projects they are members of" ON public.projects FOR SELECT 
USING (
    created_by = auth.uid() OR 
    visibility = 'public' OR 
    id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create projects" ON public.projects FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Project creators can update their projects" ON public.projects FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for project_members table
CREATE POLICY "Users can view project members for projects they belong to" ON public.project_members FOR SELECT 
USING (
    project_id IN (
        SELECT id FROM public.projects WHERE created_by = auth.uid() OR 
        id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid())
    )
);
CREATE POLICY "Project creators can manage members" ON public.project_members FOR ALL 
USING (
    project_id IN (SELECT id FROM public.projects WHERE created_by = auth.uid())
);

-- RLS Policies for tasks table
CREATE POLICY "Users can view tasks in their projects" ON public.tasks FOR SELECT 
USING (
    project_id IN (
        SELECT project_id FROM public.project_members WHERE user_id = auth.uid()
    ) OR 
    created_by = auth.uid() OR
    id IN (SELECT task_id FROM public.task_assignees WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create tasks in their projects" ON public.tasks FOR INSERT 
WITH CHECK (
    project_id IN (
        SELECT project_id FROM public.project_members WHERE user_id = auth.uid()
    )
);
CREATE POLICY "Users can update tasks they created or are assigned to" ON public.tasks FOR UPDATE 
USING (
    created_by = auth.uid() OR 
    id IN (SELECT task_id FROM public.task_assignees WHERE user_id = auth.uid())
);

-- RLS Policies for task_assignees table
CREATE POLICY "Users can view task assignees for tasks they can see" ON public.task_assignees FOR SELECT 
USING (
    task_id IN (
        SELECT id FROM public.tasks WHERE 
        project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()) OR
        created_by = auth.uid() OR
        id IN (SELECT task_id FROM public.task_assignees WHERE user_id = auth.uid())
    )
);
CREATE POLICY "Project managers can assign tasks" ON public.task_assignees FOR ALL 
USING (
    task_id IN (
        SELECT t.id FROM public.tasks t 
        JOIN public.project_members pm ON t.project_id = pm.project_id 
        JOIN public.users u ON pm.user_id = u.id 
        WHERE pm.user_id = auth.uid() AND u.role IN ('manager', 'admin')
    )
);

-- RLS Policies for comments table
CREATE POLICY "Users can view comments on tasks they can see" ON public.comments FOR SELECT 
USING (
    task_id IN (
        SELECT id FROM public.tasks WHERE 
        project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()) OR
        created_by = auth.uid() OR
        id IN (SELECT task_id FROM public.task_assignees WHERE user_id = auth.uid())
    )
);
CREATE POLICY "Users can create comments on tasks they can see" ON public.comments FOR INSERT 
WITH CHECK (
    user_id = auth.uid() AND
    task_id IN (
        SELECT id FROM public.tasks WHERE 
        project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()) OR
        created_by = auth.uid() OR
        id IN (SELECT task_id FROM public.task_assignees WHERE user_id = auth.uid())
    )
);
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for motivation_logs table
CREATE POLICY "Users can view logs for projects they belong to" ON public.motivation_logs FOR SELECT 
USING (
    project_id IN (
        SELECT project_id FROM public.project_members WHERE user_id = auth.uid()
    ) OR 
    performed_by = auth.uid()
);
CREATE POLICY "Users can create logs" ON public.motivation_logs FOR INSERT WITH CHECK (performed_by = auth.uid());

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to log activities
CREATE OR REPLACE FUNCTION public.log_activity(
  p_action_type action_type,
  p_project_id UUID DEFAULT NULL,
  p_task_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT ''
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.motivation_logs (action_type, performed_by, project_id, task_id, description)
  VALUES (p_action_type, auth.uid(), p_project_id, p_task_id, p_description)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
