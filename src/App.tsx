import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleBasedRedirect } from "@/components/auth/RoleBasedRedirect";
import { RoleBasedRoute } from "@/components/auth/RoleBasedRoute";
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
import Settings from "./pages/Settings";
import StudentsList from "./pages/admin/StudentsList";
import TeachersList from "./pages/admin/TeachersList";
import ClassesList from "./pages/admin/ClassesList";
import StreamsList from "./pages/admin/StreamsList";
import ElectoralApplications from "./pages/admin/ElectoralApplications";
import ElectoralDashboard from "./pages/admin/ElectoralDashboard";
import BallotGeneration from "./pages/admin/BallotGeneration";
import AdminGallery from "./pages/admin/AdminGallery";
import StockManagement from "./pages/admin/StockManagement";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminFinance from "./pages/admin/AdminFinance";
import AdminReports from "./pages/admin/AdminReports";
import ElectoralHub from "./pages/electoral/ElectoralHub";
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
import DutyRota from "./pages/DutyRota";
import HallOfFame from "./pages/HallOfFame";
import Birthdays from "./pages/Birthdays";
import Communication from "./pages/Communication";
import HelpSupport from "./pages/HelpSupport";
import Library from "./pages/Library";
import Games from "./pages/Games";
import TypingWizard from "./pages/games/TypingWizard";
import ELearning from "./pages/ELearning";
import Events from "./pages/Events";
import Entertainment from "./pages/Entertainment";
import MovieDetail from "./pages/MovieDetail";
import StudentAttendanceView from "./pages/student/StudentAttendanceView";
import AttendanceDetails from "./pages/admin/AttendanceDetails";
import StudentAttendanceSummary from "./pages/admin/StudentAttendanceSummary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
    >
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
                  <RoleBasedRedirect />
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              
              {/* Student Routes */}
              <Route path="/student" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/student/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/student/calendar" element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } />
              <Route path="/student/classes" element={
                <ProtectedRoute>
                  <Classes />
                </ProtectedRoute>
              } />
              <Route path="/student/assignments" element={
                <ProtectedRoute>
                  <Assignments />
                </ProtectedRoute>
              } />
              <Route path="/student/grades" element={
                <ProtectedRoute>
                  <Grades />
                </ProtectedRoute>
              } />
              <Route path="/student/timetable" element={
                <ProtectedRoute>
                  <Timetable />
                </ProtectedRoute>
              } />
              <Route path="/student/attendance" element={
                <ProtectedRoute>
                  <StudentAttendanceView />
                </ProtectedRoute>
              } />
              <Route path="/student/duty-rota" element={
                <ProtectedRoute>
                  <DutyRota />
                </ProtectedRoute>
              } />
              <Route path="/student/hall-of-fame" element={
                <ProtectedRoute>
                  <HallOfFame />
                </ProtectedRoute>
              } />
              <Route path="/student/games" element={
                <ProtectedRoute>
                  <Games />
                </ProtectedRoute>
              } />
              <Route path="/student/games/typing-wizard" element={
                <ProtectedRoute>
                  <TypingWizard />
                </ProtectedRoute>
              } />
              <Route path="/student/library" element={
                <ProtectedRoute>
                  <Library />
                </ProtectedRoute>
              } />
              <Route path="/student/communication" element={
                <ProtectedRoute>
                  <Communication />
                </ProtectedRoute>
              } />
              <Route path="/student/help" element={
                <ProtectedRoute>
                  <HelpSupport />
                </ProtectedRoute>
              } />
              <Route path="/student/gallery" element={
                <ProtectedRoute>
                  <AdminGallery />
                </ProtectedRoute>
              } />
              <Route path="/student/e-learning" element={
                <ProtectedRoute>
                  <ELearning />
                </ProtectedRoute>
              } />
              <Route path="/student/events" element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              } />
              <Route path="/student/entertainment" element={
                <ProtectedRoute>
                  <Entertainment />
                </ProtectedRoute>
              } />
              <Route path="/student/entertainment/:movieId" element={
                <ProtectedRoute>
                  <MovieDetail />
                </ProtectedRoute>
              } />
              <Route path="/student/electoral" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["student"]}>
                    <ElectoralDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/student/electoral/hub" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["student"]}>
                    <ElectoralHub />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/student/electoral/apply" element={
                <ProtectedRoute>
                  <Apply />
                </ProtectedRoute>
              } />
              <Route path="/student/electoral/status" element={
                <ProtectedRoute>
                  <ApplicationStatus />
                </ProtectedRoute>
              } />
              <Route path="/student/electoral/candidates/:position" element={
                <ProtectedRoute>
                  <Candidates />
                </ProtectedRoute>
              } />
              <Route path="/student/electoral/results" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["student"]}>
                    <LiveResults />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/student/electoral/vote" element={
                <ProtectedRoute>
                  <Vote />
                </ProtectedRoute>
              } />

              {/* Teacher Routes */}
              <Route path="/teacher" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/teacher/classes" element={
                <ProtectedRoute>
                  <Classes />
                </ProtectedRoute>
              } />
              <Route path="/teacher/students" element={
                <ProtectedRoute>
                  <StudentsList />
                </ProtectedRoute>
              } />
              <Route path="/teacher/assignments" element={
                <ProtectedRoute>
                  <Assignments />
                </ProtectedRoute>
              } />
              <Route path="/teacher/grades" element={
                <ProtectedRoute>
                  <Grades />
                </ProtectedRoute>
              } />
              <Route path="/teacher/schedule" element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } />
              <Route path="/teacher/attendance" element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              } />
              <Route path="/teacher/messages" element={
                <ProtectedRoute>
                  <Communication />
                </ProtectedRoute>
              } />
              <Route path="/teacher/reports" element={
                <ProtectedRoute>
                  <AdminReports />
                </ProtectedRoute>
              } />
              <Route path="/teacher/timetable" element={
                <ProtectedRoute>
                  <Timetable />
                </ProtectedRoute>
              } />
              <Route path="/teacher/duty-rota" element={
                <ProtectedRoute>
                  <DutyRota />
                </ProtectedRoute>
              } />
              <Route path="/teacher/gallery" element={
                <ProtectedRoute>
                  <AdminGallery />
                </ProtectedRoute>
              } />
              <Route path="/teacher/e-learning" element={
                <ProtectedRoute>
                  <ELearning />
                </ProtectedRoute>
              } />
              <Route path="/teacher/events" element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              } />
              <Route path="/teacher/entertainment" element={
                <ProtectedRoute>
                  <Entertainment />
                </ProtectedRoute>
              } />
              <Route path="/teacher/entertainment/:movieId" element={
                <ProtectedRoute>
                  <MovieDetail />
                </ProtectedRoute>
              } />
              <Route path="/teacher/electoral" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["teacher"]}>
                    <ElectoralDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/teacher/electoral/applications" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["teacher"]}>
                    <ElectoralApplications />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/admin/students" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <StudentsList />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/teachers" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <TeachersList />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/classes" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <ClassesList />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/streams" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <StreamsList />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/electoral" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin", "teacher"]}>
                    <ElectoralDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/electoral/applications" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <ElectoralApplications />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/ballot-generation" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <BallotGeneration />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/gallery" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <AdminGallery />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/library" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <Library />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/stock" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <StockManagement />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <AdminAnalytics />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/finance" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <AdminFinance />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <AdminReports />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/timetable" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <Timetable />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/duty-rota" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <DutyRota />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/attendance" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <Attendance />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/attendance/details" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <AttendanceDetails />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/attendance/student/:studentId" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <StudentAttendanceSummary />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/e-learning" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <ELearning />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/events" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <Events />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/entertainment" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <Entertainment />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/entertainment/:movieId" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <MovieDetail />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
                
                {/* Public/General Routes */}
                <Route path="/about" element={<About />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                
                <Route path="/404" element={<NotFound />} />
                 {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                 <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </AuthProvider>
        </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;