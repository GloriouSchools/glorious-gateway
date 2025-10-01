import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnimatedCard } from "@/components/ui/animated-card";
import { useAuth } from "@/hooks/useAuth";
import { 
  BookOpen, 
  ArrowLeft,
  FileText,
  ClipboardList,
  Scroll,
  Library as LibraryIcon,
  GraduationCap,
  BookMarked,
  FileCheck
} from "lucide-react";

interface ClassLevel {
  id: string;
  name: string;
  displayName: string;
  isSpecial: boolean;
  color: string;
  image?: string;
}

interface ResourceType {
  id: string;
  name: string;
  icon: any;
  color: string;
}

interface Subject {
  id: string;
  name: string;
  color: string;
}

const classLevels: ClassLevel[] = [
  { id: 'baby', name: 'Baby', displayName: 'Baby Class', isSpecial: true, color: 'from-slate-600 to-slate-700' },
  { id: 'middle', name: 'Middle', displayName: 'Middle Class', isSpecial: true, color: 'from-slate-600 to-slate-700' },
  { id: 'top', name: 'Top', displayName: 'Top Class', isSpecial: true, color: 'from-slate-600 to-slate-700' },
  { id: 'p1', name: 'P.1', displayName: 'Primary One', isSpecial: false, color: 'from-blue-700 to-blue-800' },
  { id: 'p2', name: 'P.2', displayName: 'Primary Two', isSpecial: false, color: 'from-blue-700 to-blue-800' },
  { id: 'p3', name: 'P.3', displayName: 'Primary Three', isSpecial: false, color: 'from-blue-700 to-blue-800' },
  { id: 'p4', name: 'P.4', displayName: 'Primary Four', isSpecial: false, color: 'from-blue-700 to-blue-800' },
  { id: 'p5', name: 'P.5', displayName: 'Primary Five', isSpecial: false, color: 'from-blue-700 to-blue-800' },
  { id: 'p6', name: 'P.6', displayName: 'Primary Six', isSpecial: false, color: 'from-blue-700 to-blue-800' },
  { id: 'p7', name: 'P.7', displayName: 'Primary Seven', isSpecial: false, color: 'from-blue-700 to-blue-800' },
];

const resourceTypes: ResourceType[] = [
  { id: 'lesson-notes', name: 'Lesson Notes', icon: FileText, color: 'from-emerald-700 to-emerald-800' },
  { id: 'schemes-of-work', name: 'Schemes of Work', icon: ClipboardList, color: 'from-amber-700 to-amber-800' },
  { id: 'past-papers', name: 'Past Papers', icon: Scroll, color: 'from-indigo-700 to-indigo-800' },
];

const subjects: Subject[] = [
  { id: 'mathematics', name: 'Mathematics', color: 'from-blue-800 to-blue-900' },
  { id: 'english', name: 'English', color: 'from-rose-800 to-rose-900' },
  { id: 'science', name: 'Science', color: 'from-emerald-800 to-emerald-900' },
  { id: 'social-studies', name: 'Social Studies', color: 'from-amber-800 to-amber-900' },
  { id: 'ict', name: 'ICT', color: 'from-indigo-800 to-indigo-900' },
];

type ViewState = 'classes' | 'resources' | 'subjects';

const Library = () => {
  const { userRole, userName, photoUrl, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('classes');
  const [selectedClass, setSelectedClass] = useState<ClassLevel | null>(null);
  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(null);

  const handleClassSelect = (classLevel: ClassLevel) => {
    setSelectedClass(classLevel);
    setCurrentView('resources');
  };

  const handleResourceSelect = (resource: ResourceType) => {
    setSelectedResource(resource);
    if (selectedClass?.isSpecial) {
      // For special classes, navigate directly to the resource
      alert(`Opening ${selectedClass.displayName} - ${resource.name}`);
    } else {
      // For regular classes, show subjects
      setCurrentView('subjects');
    }
  };

  const handleSubjectSelect = (subject: Subject) => {
    // Navigate to the final resource page
    alert(`Opening ${selectedClass?.displayName} - ${subject.name} - ${selectedResource?.name}`);
  };

  const backToClasses = () => {
    setCurrentView('classes');
    setSelectedClass(null);
    setSelectedResource(null);
  };

  const backToResources = () => {
    setCurrentView('resources');
    setSelectedResource(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  if (!userRole) return null;

  return (
    <DashboardLayout 
      userRole={userRole} 
      userName={userName || "Student"}
      photoUrl={photoUrl}
      onLogout={handleLogout}
    >
      <div className="space-y-8 animate-fade-in font-inter">
        {/* Professional Header */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-8 shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 dark:bg-blue-900 rounded-full -mr-32 -mt-32 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-100 dark:bg-indigo-900 rounded-full -ml-24 -mb-24 opacity-20"></div>
          
          <div className="relative z-10 text-center space-y-4">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl shadow-xl">
                <LibraryIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 tracking-tight font-merriweather">
              Academic Resource Library
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Glorious Schools' comprehensive digital library providing access to lesson notes, 
              schemes of work, and past examination papers for all class levels
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                <GraduationCap className="h-4 w-4 mr-2 inline" />
                Academic Excellence
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                <BookMarked className="h-4 w-4 mr-2 inline" />
                Quality Resources
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                <FileCheck className="h-4 w-4 mr-2 inline" />
                Verified Content
              </Badge>
            </div>
          </div>
        </div>

        {/* Class List View */}
        {currentView === 'classes' && (
          <Card className="shadow-lg border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-b">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-merriweather">
                Select Class Level
              </CardTitle>
              <CardDescription className="text-base">
                Choose your class to access academic resources
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {classLevels.map((classLevel, index) => (
                  <AnimatedCard
                    key={classLevel.id}
                    hoverAnimation="float"
                    delay={index * 50}
                    className="cursor-pointer group overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl"
                    onClick={() => handleClassSelect(classLevel)}
                  >
                    <div className="p-6 flex flex-col items-center justify-center h-full bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                      <div className={`w-16 h-16 mb-4 rounded-full bg-gradient-to-br ${classLevel.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-center text-base">
                        {classLevel.displayName}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {classLevel.name}
                      </p>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resource List View */}
        {currentView === 'resources' && selectedClass && (
          <Card className="shadow-lg border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-merriweather">
                    {selectedClass.displayName}
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    Select the type of resource you need
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-base px-4 py-2">
                  {selectedClass.name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {resourceTypes.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <AnimatedCard
                      key={resource.id}
                      hoverAnimation="float"
                      delay={index * 100}
                      className="cursor-pointer group border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden"
                      onClick={() => handleResourceSelect(resource)}
                    >
                      <div className="p-8 flex flex-col items-center justify-center bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 h-full">
                        <div className={`w-20 h-20 mb-6 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-center text-lg mb-2">
                          {resource.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                          Access comprehensive {resource.name.toLowerCase()}
                        </p>
                      </div>
                    </AnimatedCard>
                  );
                })}
              </div>
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={backToClasses}
                  className="gap-2 border-slate-300 dark:border-slate-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Class Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subject List View */}
        {currentView === 'subjects' && selectedClass && selectedResource && (
          <Card className="shadow-lg border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-b">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span>{selectedClass.displayName}</span>
                  <span>›</span>
                  <span>{selectedResource.name}</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-merriweather">
                  Select Subject
                </CardTitle>
                <CardDescription className="text-base">
                  Choose a subject to access {selectedResource.name.toLowerCase()}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {subjects.map((subject, index) => (
                  <AnimatedCard
                    key={subject.id}
                    hoverAnimation="float"
                    delay={index * 50}
                    className="cursor-pointer group border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden"
                    onClick={() => handleSubjectSelect(subject)}
                  >
                    <div className="p-6 flex flex-col items-center justify-center bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 h-full">
                      <div className={`w-16 h-16 mb-4 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-3xl">
                          {subject.id === 'mathematics' ? '∑' : 
                           subject.id === 'english' ? 'A' : 
                           subject.id === 'science' ? '⚗' : 
                           subject.id === 'social-studies' ? '🌐' : '⌨'}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-center text-base mb-1">
                        {subject.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                        {selectedClass.name}
                      </p>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={backToResources}
                  className="gap-2 border-slate-300 dark:border-slate-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Resource Types
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Library;