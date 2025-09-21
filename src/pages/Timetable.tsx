import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { 
  Clock, 
  Calendar, 
  BookOpen, 
  MapPin,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Bell,
  Play,
  Pause
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";

interface TimeSlot {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  day: string;
  type: 'class' | 'break' | 'lunch' | 'assembly' | 'sport';
  color: string;
}

interface WeekSchedule {
  [key: string]: TimeSlot[];
}

// Mock timetable data
const mockTimetable: WeekSchedule = {
  Monday: [
    {
      id: 'M1',
      subject: 'Mathematics',
      teacher: 'Mr. Johnson',
      room: 'Room 201',
      startTime: '08:00',
      endTime: '09:30',
      day: 'Monday',
      type: 'class',
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    },
    {
      id: 'M2',
      subject: 'Break',
      teacher: '',
      room: 'Playground',
      startTime: '09:30',
      endTime: '10:00',
      day: 'Monday',
      type: 'break',
      color: 'bg-green-100 border-green-300 text-green-800'
    },
    {
      id: 'M3',
      subject: 'English Literature',
      teacher: 'Ms. Smith',
      room: 'Room 105',
      startTime: '10:00',
      endTime: '11:30',
      day: 'Monday',
      type: 'class',
      color: 'bg-purple-100 border-purple-300 text-purple-800'
    },
    {
      id: 'M4',
      subject: 'Science',
      teacher: 'Dr. Wilson',
      room: 'Lab 1',
      startTime: '11:30',
      endTime: '13:00',
      day: 'Monday',
      type: 'class',
      color: 'bg-emerald-100 border-emerald-300 text-emerald-800'
    },
    {
      id: 'M5',
      subject: 'Lunch Break',
      teacher: '',
      room: 'Cafeteria',
      startTime: '13:00',
      endTime: '14:00',
      day: 'Monday',
      type: 'lunch',
      color: 'bg-orange-100 border-orange-300 text-orange-800'
    },
    {
      id: 'M6',
      subject: 'History',
      teacher: 'Mrs. Brown',
      room: 'Room 302',
      startTime: '14:00',
      endTime: '15:30',
      day: 'Monday',
      type: 'class',
      color: 'bg-amber-100 border-amber-300 text-amber-800'
    }
  ],
  Tuesday: [
    {
      id: 'T1',
      subject: 'English Grammar',
      teacher: 'Ms. Smith',
      room: 'Room 105',
      startTime: '08:00',
      endTime: '09:30',
      day: 'Tuesday',
      type: 'class',
      color: 'bg-purple-100 border-purple-300 text-purple-800'
    },
    {
      id: 'T2',
      subject: 'Break',
      teacher: '',
      room: 'Playground',
      startTime: '09:30',
      endTime: '10:00',
      day: 'Tuesday',
      type: 'break',
      color: 'bg-green-100 border-green-300 text-green-800'
    },
    {
      id: 'T3',
      subject: 'Physical Education',
      teacher: 'Coach Davis',
      room: 'Sports Field',
      startTime: '10:00',
      endTime: '11:30',
      day: 'Tuesday',
      type: 'sport',
      color: 'bg-red-100 border-red-300 text-red-800'
    },
    {
      id: 'T4',
      subject: 'Art & Craft',
      teacher: 'Ms. Taylor',
      room: 'Art Room',
      startTime: '11:30',
      endTime: '13:00',
      day: 'Tuesday',
      type: 'class',
      color: 'bg-pink-100 border-pink-300 text-pink-800'
    },
    {
      id: 'T5',
      subject: 'Lunch Break',
      teacher: '',
      room: 'Cafeteria',
      startTime: '13:00',
      endTime: '14:00',
      day: 'Tuesday',
      type: 'lunch',
      color: 'bg-orange-100 border-orange-300 text-orange-800'
    },
    {
      id: 'T6',
      subject: 'Mathematics',
      teacher: 'Mr. Johnson',
      room: 'Room 201',
      startTime: '14:00',
      endTime: '15:30',
      day: 'Tuesday',
      type: 'class',
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    }
  ],
  Wednesday: [
    {
      id: 'W1',
      subject: 'Assembly',
      teacher: 'Principal',
      room: 'Main Hall',
      startTime: '08:00',
      endTime: '08:30',
      day: 'Wednesday',
      type: 'assembly',
      color: 'bg-indigo-100 border-indigo-300 text-indigo-800'
    },
    {
      id: 'W2',
      subject: 'Science',
      teacher: 'Dr. Wilson',
      room: 'Lab 1',
      startTime: '08:30',
      endTime: '10:00',
      day: 'Wednesday',
      type: 'class',
      color: 'bg-emerald-100 border-emerald-300 text-emerald-800'
    },
    {
      id: 'W3',
      subject: 'Break',
      teacher: '',
      room: 'Playground',
      startTime: '10:00',
      endTime: '10:30',
      day: 'Wednesday',
      type: 'break',
      color: 'bg-green-100 border-green-300 text-green-800'
    },
    {
      id: 'W4',
      subject: 'Geography',
      teacher: 'Mr. Anderson',
      room: 'Room 203',
      startTime: '10:30',
      endTime: '12:00',
      day: 'Wednesday',
      type: 'class',
      color: 'bg-teal-100 border-teal-300 text-teal-800'
    },
    {
      id: 'W5',
      subject: 'English Literature',
      teacher: 'Ms. Smith',
      room: 'Room 105',
      startTime: '12:00',
      endTime: '13:00',
      day: 'Wednesday',
      type: 'class',
      color: 'bg-purple-100 border-purple-300 text-purple-800'
    },
    {
      id: 'W6',
      subject: 'Lunch Break',
      teacher: '',
      room: 'Cafeteria',
      startTime: '13:00',
      endTime: '14:00',
      day: 'Wednesday',
      type: 'lunch',
      color: 'bg-orange-100 border-orange-300 text-orange-800'
    },
    {
      id: 'W7',
      subject: 'Music',
      teacher: 'Ms. Garcia',
      room: 'Music Room',
      startTime: '14:00',
      endTime: '15:30',
      day: 'Wednesday',
      type: 'class',
      color: 'bg-violet-100 border-violet-300 text-violet-800'
    }
  ],
  Thursday: [
    {
      id: 'TH1',
      subject: 'Mathematics',
      teacher: 'Mr. Johnson',
      room: 'Room 201',
      startTime: '08:00',
      endTime: '09:30',
      day: 'Thursday',
      type: 'class',
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    },
    {
      id: 'TH2',
      subject: 'Break',
      teacher: '',
      room: 'Playground',
      startTime: '09:30',
      endTime: '10:00',
      day: 'Thursday',
      type: 'break',
      color: 'bg-green-100 border-green-300 text-green-800'
    },
    {
      id: 'TH3',
      subject: 'Computer Science',
      teacher: 'Mr. Lee',
      room: 'Computer Lab',
      startTime: '10:00',
      endTime: '11:30',
      day: 'Thursday',
      type: 'class',
      color: 'bg-cyan-100 border-cyan-300 text-cyan-800'
    },
    {
      id: 'TH4',
      subject: 'History',
      teacher: 'Mrs. Brown',
      room: 'Room 302',
      startTime: '11:30',
      endTime: '13:00',
      day: 'Thursday',
      type: 'class',
      color: 'bg-amber-100 border-amber-300 text-amber-800'
    },
    {
      id: 'TH5',
      subject: 'Lunch Break',
      teacher: '',
      room: 'Cafeteria',
      startTime: '13:00',
      endTime: '14:00',
      day: 'Thursday',
      type: 'lunch',
      color: 'bg-orange-100 border-orange-300 text-orange-800'
    },
    {
      id: 'TH6',
      subject: 'Science Lab',
      teacher: 'Dr. Wilson',
      room: 'Lab 2',
      startTime: '14:00',
      endTime: '15:30',
      day: 'Thursday',
      type: 'class',
      color: 'bg-emerald-100 border-emerald-300 text-emerald-800'
    }
  ],
  Friday: [
    {
      id: 'F1',
      subject: 'English Grammar',
      teacher: 'Ms. Smith',
      room: 'Room 105',
      startTime: '08:00',
      endTime: '09:30',
      day: 'Friday',
      type: 'class',
      color: 'bg-purple-100 border-purple-300 text-purple-800'
    },
    {
      id: 'F2',
      subject: 'Break',
      teacher: '',
      room: 'Playground',
      startTime: '09:30',
      endTime: '10:00',
      day: 'Friday',
      type: 'break',
      color: 'bg-green-100 border-green-300 text-green-800'
    },
    {
      id: 'F3',
      subject: 'Physical Education',
      teacher: 'Coach Davis',
      room: 'Sports Field',
      startTime: '10:00',
      endTime: '11:30',
      day: 'Friday',
      type: 'sport',
      color: 'bg-red-100 border-red-300 text-red-800'
    },
    {
      id: 'F4',
      subject: 'Mathematics',
      teacher: 'Mr. Johnson',
      room: 'Room 201',
      startTime: '11:30',
      endTime: '13:00',
      day: 'Friday',
      type: 'class',
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    },
    {
      id: 'F5',
      subject: 'Lunch Break',
      teacher: '',
      room: 'Cafeteria',
      startTime: '13:00',
      endTime: '14:00',
      day: 'Friday',
      type: 'lunch',
      color: 'bg-orange-100 border-orange-300 text-orange-800'
    },
    {
      id: 'F6',
      subject: 'Library Period',
      teacher: 'Ms. Rodriguez',
      room: 'Library',
      startTime: '14:00',
      endTime: '15:30',
      day: 'Friday',
      type: 'class',
      color: 'bg-slate-100 border-slate-300 text-slate-800'
    }
  ]
};

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
  '14:00', '14:30', '15:00', '15:30'
];

const Timetable = () => {
  const { userRole, userName, photoUrl, signOut } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState(new Date());

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const subjects = [...new Set(
    Object.values(mockTimetable)
      .flat()
      .filter(slot => slot.type === 'class')
      .map(slot => slot.subject)
  )];

  const filteredTimetable = Object.entries(mockTimetable).reduce((acc, [day, slots]) => {
    const filteredSlots = slots.filter(slot => {
      const matchesSearch = slot.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           slot.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           slot.room.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = filterSubject === "all" || slot.subject === filterSubject;
      
      return matchesSearch && matchesSubject;
    });
    acc[day] = filteredSlots;
    return acc;
  }, {} as WeekSchedule);

  const getCurrentClass = () => {
    const now = new Date();
    const currentTime = format(now, 'HH:mm');
    const currentDay = format(now, 'EEEE');
    
    const todaySlots = mockTimetable[currentDay] || [];
    return todaySlots.find(slot => 
      currentTime >= slot.startTime && currentTime <= slot.endTime
    );
  };

  const getNextClass = () => {
    const now = new Date();
    const currentTime = format(now, 'HH:mm');
    const currentDay = format(now, 'EEEE');
    
    const todaySlots = mockTimetable[currentDay] || [];
    return todaySlots.find(slot => 
      currentTime < slot.startTime
    );
  };

  const currentClass = getCurrentClass();
  const nextClass = getNextClass();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedWeek(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  if (!userRole) return null;

  return (
    <DashboardLayout 
      userRole={userRole} 
      userName={userName || "Student"}
      photoUrl={photoUrl}
      onLogout={handleLogout}
    >
        <div className="space-y-4 md:space-y-6 animate-fade-in px-2 md:px-0">
        <div className="flex flex-col gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-elegant bg-clip-text text-transparent">
              My Timetable
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Your weekly class schedule and important timings
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center md:justify-end items-center gap-2">
            <Select value={viewMode} onValueChange={(value: 'week' | 'day') => setViewMode(value)}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week View</SelectItem>
                <SelectItem value="day">Day View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Current Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Play className="h-4 w-4" />
                Current Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentClass ? (
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{currentClass.subject}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{currentClass.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{currentClass.room}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{currentClass.startTime} - {currentClass.endTime}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Pause className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No class in session</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Next Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextClass ? (
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{nextClass.subject}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{nextClass.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{nextClass.room}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{nextClass.startTime} - {nextClass.endTime}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No more classes today</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters and Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-center flex-1 min-w-0">
                  Week of {format(weekStart, 'MMM dd, yyyy')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search subjects, teachers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Timetable */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>
              Your complete weekly timetable with all classes and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop View */}
            <div className="hidden xl:block">
              <div className="overflow-x-auto">
                <div className="min-w-0 w-full">
                  {/* Header */}
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    <div className="text-sm font-medium text-muted-foreground p-2 text-center">Time</div>
                    {weekDays.map(day => (
                      <div key={day} className="text-sm font-medium text-muted-foreground p-2 text-center">
                        {day.slice(0, 3)}
                      </div>
                    ))}
                  </div>

                  {/* Time slots */}
                  <div className="space-y-1">
                    {timeSlots.map(timeSlot => {
                      const getClassAtTime = (day: string) => {
                        return filteredTimetable[day]?.find(slot => 
                          slot.startTime <= timeSlot && slot.endTime > timeSlot
                        );
                      };

                      return (
                        <div key={timeSlot} className="grid grid-cols-6 gap-2">
                          <div className="text-xs font-medium p-2 border rounded bg-muted/50 text-center">
                            {timeSlot}
                          </div>
                          {weekDays.map(day => {
                            const classAtTime = getClassAtTime(day);
                            return (
                              <div key={`${day}-${timeSlot}`} className="min-w-0">
                                {classAtTime && (
                                  <div className={`p-2 rounded border-2 ${classAtTime.color} transition-all hover:scale-105 cursor-pointer`}>
                                    <div className="text-xs font-medium truncate" title={classAtTime.subject}>
                                      {classAtTime.subject}
                                    </div>
                                    {classAtTime.teacher && (
                                      <div className="text-xs opacity-75 truncate mt-1" title={classAtTime.teacher}>
                                        {classAtTime.teacher}
                                      </div>
                                    )}
                                    {classAtTime.room && (
                                      <div className="text-xs opacity-75 truncate mt-1" title={classAtTime.room}>
                                        {classAtTime.room}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet View */}
            <div className="xl:hidden">
              <div className="space-y-4">
                {weekDays.map(day => {
                  const daySlots = filteredTimetable[day] || [];
                  
                  return (
                    <Card key={day} className="shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{day}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {daySlots.length === 0 ? (
                          <div className="text-center py-6 text-muted-foreground">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No classes scheduled</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {daySlots.map(slot => (
                              <div 
                                key={slot.id} 
                                className={`p-4 rounded-lg border-2 ${slot.color} transition-all hover:scale-[1.02]`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-base truncate" title={slot.subject}>
                                      {slot.subject}
                                    </h4>
                                    {slot.teacher && (
                                      <div className="flex items-center gap-2 text-sm opacity-75 mt-1">
                                        <Users className="h-4 w-4 flex-shrink-0" />
                                        <span className="truncate" title={slot.teacher}>
                                          {slot.teacher}
                                        </span>
                                      </div>
                                    )}
                                    {slot.room && (
                                      <div className="flex items-center gap-2 text-sm opacity-75 mt-1">
                                        <MapPin className="h-4 w-4 flex-shrink-0" />
                                        <span className="truncate" title={slot.room}>
                                          {slot.room}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm font-medium whitespace-nowrap">
                                    <Clock className="h-4 w-4" />
                                    <span>{slot.startTime} - {slot.endTime}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Timetable;