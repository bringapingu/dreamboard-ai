import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KanbanBoard } from '@/components/KanbanBoard';
import Auth from '@/pages/Auth';
import { Session } from '@supabase/supabase-js';

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-background" />;
  }

  return session ? <KanbanBoard /> : <Auth />;
};

export default Index;
