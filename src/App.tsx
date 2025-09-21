import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageTransition } from "@/components/PageTransition";
import Index from "./pages/Index";
import { LoginPage } from "./pages/Login";
import { VerifyCallback } from "./pages/VerifyCallback";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import About from "./pages/About";
import Disclaimer from "./pages/Disclaimer";
import Legal from "./pages/Legal";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import StudentsList from "./pages/admin/StudentsList";
import TeachersList from "./pages/admin/TeachersList";
import ClassesList from "./pages/admin/ClassesList";
import StreamsList from "./pages/admin/StreamsList";
import ElectoralApplications from "./pages/admin/ElectoralApplications";
import Electoral from "./pages/Electoral";
import Apply from "./pages/electoral/Apply";
import ApplicationStatus from "./pages/electoral/ApplicationStatus";
import Candidates from "./pages/electoral/Candidates";
import LiveResults from "./pages/electoral/LiveResults";
import Vote from "./pages/electoral/Vote";
import Calendar from "./pages/Calendar";
import Classes from "./pages/Classes";
import Assignments from "./pages/Assignments";
import Grades from "./pages/Grades";
import Timetable from "./pages/Timetable";
import Attendance from "./pages/Attendance";
import HallOfFame from "./pages/HallOfFame";
import Birthdays from "./pages/Birthdays";
import Communication from "./pages/Communication";
import HelpSupport from "./pages/HelpSupport";
import Library from "./pages/Library";
import Games from "./pages/Games";
import TypingWizard from "./pages/games/TypingWizard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <PageTransition>
              <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/verify-callback" element={<VerifyCallback />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/admin/students" element={
                <ProtectedRoute>
                  <StudentsList />
                </ProtectedRoute>
              } />
              <Route path="/admin/teachers" element={
                <ProtectedRoute>
                  <TeachersList />
                </ProtectedRoute>
              } />
              <Route path="/admin/classes" element={
                <ProtectedRoute>
                  <ClassesList />
                </ProtectedRoute>
              } />
              <Route path="/admin/streams" element={
                <ProtectedRoute>
                  <StreamsList />
                </ProtectedRoute>
              } />
              <Route path="/admin/electoral" element={
                <ProtectedRoute>
                  <ElectoralApplications />
                </ProtectedRoute>
              } />
              <Route path="/electoral" element={
                <ProtectedRoute>
                  <Electoral />
                </ProtectedRoute>
              } />
              <Route path="/electoral/apply" element={
                <ProtectedRoute>
                  <Apply />
                </ProtectedRoute>
              } />
              <Route path="/electoral/status" element={
                <ProtectedRoute>
                  <ApplicationStatus />
                </ProtectedRoute>
              } />
              <Route path="/electoral/candidates/:position" element={<Candidates />} />
              <Route path="/electoral/vote" element={
                <ProtectedRoute>
                  <Vote />
                </ProtectedRoute>
              } />
              <Route path="/electoral/results" element={
                <ProtectedRoute>
                  <LiveResults />
                </ProtectedRoute>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } />
              <Route path="/classes" element={
                <ProtectedRoute>
                  <Classes />
                </ProtectedRoute>
              } />
              <Route path="/assignments" element={
                <ProtectedRoute>
                  <Assignments />
                </ProtectedRoute>
              } />
              <Route path="/grades" element={
                <ProtectedRoute>
                  <Grades />
                </ProtectedRoute>
              } />
              <Route path="/timetable" element={
                <ProtectedRoute>
                  <Timetable />
                </ProtectedRoute>
              } />
              <Route path="/attendance" element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              } />
               <Route path="/hall-of-fame" element={
                 <ProtectedRoute>
                   <HallOfFame />
                 </ProtectedRoute>
               } />
               <Route path="/games" element={
                 <ProtectedRoute>
                   <Games />
                 </ProtectedRoute>
               } />
               <Route path="/games/typing-wizard" element={
                 <ProtectedRoute>
                   <TypingWizard />
                 </ProtectedRoute>
               } />
              <Route path="/birthdays" element={
                <ProtectedRoute>
                  <Birthdays />
                </ProtectedRoute>
              } />
              <Route path="/communication" element={
                <ProtectedRoute>
                  <Communication />
                </ProtectedRoute>
              } />
              <Route path="/help-support" element={
                <ProtectedRoute>
                  <HelpSupport />
                </ProtectedRoute>
              } />
              <Route path="/help" element={
                <ProtectedRoute>
                  <HelpSupport />
                </ProtectedRoute>
              } />
               <Route path="/library" element={
                 <ProtectedRoute>
                   <Library />
                 </ProtectedRoute>
               } />
               <Route path="/404" element={<NotFound />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;