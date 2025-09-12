// Utility to populate dummy electoral data for testing

export const populateDummyElectoralData = () => {
  // Clear existing dummy data first
  clearDummyElectoralData();
  
  const dummyApplications = [
    // Head Prefect Candidates
    {
      id: "dummy_head_prefect_1",
      student_name: "NAKAYIZA MILKAH",
      student_email: "nakayiza.milkah@gloriousschools.com",
      student_photo: undefined,
      position: "head_prefect",
      class: "P5",
      stream: "SKYHIGH",
      experience: "I have served as class monitor for 2 years and head of the debate club. I organized our class fundraising activities and represented our school in inter-school competitions.",
      qualifications: "Strong leadership skills, excellent communication, experience in conflict resolution, and a track record of successful event organization.",
      whyApply: "I want to bridge the gap between students and administration, improve our school facilities, and create more opportunities for student voice in decision-making.",
      status: "pending",
      submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "dummy_head_prefect_2", 
      student_name: "MUKASA BRYTON",
      student_email: "mukasa.bryton@gloriousschools.com",
      student_photo: undefined,
      position: "head_prefect",
      class: "P5",
      stream: "SUNRISE",
      experience: "Captain of the school football team, former entertainment prefect, and student council member. I have organized sports tournaments and cultural events.",
      qualifications: "Natural leader, team player, excellent public speaking skills, and experience managing large groups of students.",
      whyApply: "I believe every student should have equal opportunities and a voice. I want to work on improving our sports facilities and creating more inclusive school policies.",
      status: "pending",
      submitted_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "dummy_head_prefect_3",
      student_name: "NAMATOVU IMMACULATE",
      student_email: "namatovu.immaculate@gloriousschools.com", 
      student_photo: undefined,
      position: "head_prefect",
      class: "P5",
      stream: "SUNSET",
      experience: "Head of the school choir, academic prefect assistant, and peer tutoring coordinator. I've helped improve our school's academic performance.",
      qualifications: "Excellent academic performance, strong organizational skills, experience in mentoring younger students, and proven ability to work with teachers and staff.",
      whyApply: "I want to focus on academic excellence while ensuring students have a balanced school life with enough time for co-curricular activities and personal development.",
      status: "pending",
      submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },

    // Academic Prefect Candidates
    {
      id: "dummy_academic_prefect_1",
      student_name: "KIGGUNDU FAVOUR MARCUS",
      student_email: "kiggundu.favour@gloriousschools.com",
      student_photo: undefined,
      position: "academic_prefect",
      class: "P5",
      stream: "SKYHIGH", 
      experience: "Top 3 in class for the past 2 years, leader of the mathematics club, and tutor for P3 and P4 students. I've organized study groups and academic competitions.",
      qualifications: "Excellent academic record, strong analytical skills, patience in teaching others, and ability to create effective study schedules.",
      whyApply: "I want to improve our school's academic standards by organizing peer tutoring programs, study competitions, and better resource allocation for academic activities.",
      status: "pending",
      submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "dummy_academic_prefect_2",
      student_name: "NINSIIMA MARY SHALOM",
      student_email: "ninsiima.mary@gloriousschools.com",
      student_photo: undefined,
      position: "academic_prefect",
      class: "P5",
      stream: "SUNRISE",
      experience: "Head of the science club, winner of multiple academic competitions, and assistant to teachers in laboratory sessions. I've mentored struggling students.",
      qualifications: "Strong in STEM subjects, excellent research skills, ability to explain complex concepts simply, and experience in project management.",
      whyApply: "I believe every student can excel academically with the right support. I want to establish study groups, improve our library resources, and create academic mentorship programs.",
      status: "pending", 
      submitted_at: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString()
    },

    // Entertainment Prefect Candidates
    {
      id: "dummy_entertainment_prefect_1",
      student_name: "KAYEMBA SHAN",
      student_email: "kayemba.shan@gloriousschools.com",
      student_photo: undefined,
      position: "entertainment_prefect",
      class: "P5",
      stream: "SUNSET",
      experience: "Lead dancer in school cultural performances, organized talent shows, and coordinated music events. I've been part of drama club for 3 years.",
      qualifications: "Creative thinking, event planning experience, strong networking skills with local artists, and ability to work with diverse talent.",
      whyApply: "I want to make our school events more exciting and inclusive, bringing in diverse forms of entertainment that reflect our rich cultural heritage.",
      status: "pending",
      submitted_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "dummy_entertainment_prefect_2",
      student_name: "SSEMATIMBA MARK", 
      student_email: "ssematimba.mark@gloriousschools.com",
      student_photo: undefined,
      position: "entertainment_prefect",
      class: "P5",
      stream: "SUNRISE",
      experience: "School DJ for events, organizer of movie nights, and coordinator of inter-house competitions. I've managed sound systems and entertainment equipment.",
      qualifications: "Technical skills with audio equipment, creative event planning, good relationships with students across all classes, and experience with budget management.",
      whyApply: "I want to modernize our entertainment activities, introduce new forms of fun like gaming tournaments and outdoor activities, while maintaining our cultural traditions.",
      status: "pending",
      submitted_at: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString()
    },

    // Games and Sports Prefect Candidates  
    {
      id: "dummy_games_sports_prefect_1",
      student_name: "TUSUBIRA ARTHUR",
      student_email: "tusubira.arthur@gloriousschools.com",
      student_photo: undefined,
      position: "games_sports_prefect", 
      class: "P5",
      stream: "SKYHIGH",
      experience: "Captain of the school basketball team, organized inter-class tournaments, and represented the school in regional competitions. I've coached younger students.",
      qualifications: "Excellent athletic ability, leadership in team sports, experience in tournament organization, and knowledge of sports equipment and facilities.",
      whyApply: "I want to improve our sports facilities, organize more frequent competitions, and ensure every student has opportunities to participate in sports regardless of skill level.",
      status: "pending",
      submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },

    // Health & Sanitation Candidates
    {
      id: "dummy_health_sanitation_1",
      student_name: "SSAAZI WYNAND RAUBEN",
      student_email: "ssaazi.wynand@gloriousschools.com",
      student_photo: undefined,
      position: "health_sanitation",
      class: "P3", 
      stream: "CRANES",
      experience: "Health club member, first aid certified, and organizer of cleanliness campaigns. I've conducted health awareness sessions for younger students.",
      qualifications: "First aid certification, knowledge of hygiene practices, experience in health education, and ability to work with school nurse and medical staff.",
      whyApply: "I want to improve our school's hygiene standards, organize regular health check-ups, and educate students about healthy living practices.",
      status: "pending",
      submitted_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
    },

    // Time Keeper Candidates
    {
      id: "dummy_time_keeper_1",
      student_name: "MIGADDE SHAKUR SUCCESS",
      student_email: "migadde.shakur@gloriousschools.com",
      student_photo: undefined,
      position: "time_keeper",
      class: "P4",
      stream: "EAGLETS", 
      experience: "Always punctual, helped coordinate class schedules, and assisted teachers with timing during examinations. I've organized study timetables for my classmates.",
      qualifications: "Excellent time management skills, reliability, attention to detail, and experience with scheduling and coordinating events.",
      whyApply: "I want to help improve punctuality across the school, optimize our daily schedules, and ensure efficient use of time for both academic and co-curricular activities.",
      status: "pending",
      submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Save each application to localStorage
  dummyApplications.forEach(app => {
    const key = `electoral_application_${app.id}`;
    localStorage.setItem(key, JSON.stringify(app));
  });

  console.log(`Added ${dummyApplications.length} dummy electoral applications to localStorage`);
  
  return dummyApplications.length;
};

export const clearDummyElectoralData = () => {
  // Remove all dummy electoral applications
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('electoral_application_dummy_')) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  console.log(`Removed ${keysToRemove.length} dummy electoral applications from localStorage`);
  
  return keysToRemove.length;
};

export const checkDummyDataExists = () => {
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('electoral_application_dummy_')) {
      count++;
    }
  }
  return count;
};
