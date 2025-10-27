import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Search, MessageSquare, AlertCircle } from "lucide-react";

export default function Friends() {
  const { userName, photoUrl } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <DashboardLayout
      userRole="student"
      userName={userName}
      photoUrl={photoUrl}
      onLogout={() => navigate('/login')}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">My Friends</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect with your friends
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Friends Feature Coming Soon!</h3>
              <p className="text-muted-foreground mb-4">
                The friends system is currently being set up. Check back soon to connect with your classmates!
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate('/classmates')}>
                  View Classmates
                </Button>
                <Button variant="outline" onClick={() => navigate('/streammates')}>
                  View Streammates
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
