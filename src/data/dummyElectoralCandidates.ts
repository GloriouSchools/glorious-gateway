export interface DummyCandidate {
  id: string;
  student_name: string;
  student_email: string;
  student_photo: string | null;
  position: string;
  class_name: string;
  stream_name: string;
  sex: string;
  status: string;
}

export const dummyCandidates: DummyCandidate[] = [
  // Head Girl - 5 candidates
  {
    id: "C01",
    student_name: "Sarah K.",
    student_email: "sarah.k@glorious.edu.ug",
    student_photo: null,
    position: "Head Girl",
    class_name: "P6",
    stream_name: "Gold",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C02",
    student_name: "Ruth M.",
    student_email: "ruth.m@glorious.edu.ug",
    student_photo: null,
    position: "Head Girl",
    class_name: "P6",
    stream_name: "Silver",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C03",
    student_name: "Grace N.",
    student_email: "grace.n@glorious.edu.ug",
    student_photo: null,
    position: "Head Girl",
    class_name: "P6",
    stream_name: "Bronze",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C04",
    student_name: "Mary T.",
    student_email: "mary.t@glorious.edu.ug",
    student_photo: null,
    position: "Head Girl",
    class_name: "P5",
    stream_name: "Gold",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C05",
    student_name: "Faith W.",
    student_email: "faith.w@glorious.edu.ug",
    student_photo: null,
    position: "Head Girl",
    class_name: "P5",
    stream_name: "Silver",
    sex: "Female",
    status: "confirmed"
  },
  // Head Boy - 5 candidates
  {
    id: "C06",
    student_name: "Ali B.",
    student_email: "ali.b@glorious.edu.ug",
    student_photo: null,
    position: "Head Boy",
    class_name: "P6",
    stream_name: "Gold",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C07",
    student_name: "Tom W.",
    student_email: "tom.w@glorious.edu.ug",
    student_photo: null,
    position: "Head Boy",
    class_name: "P6",
    stream_name: "Silver",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C08",
    student_name: "John M.",
    student_email: "john.m@glorious.edu.ug",
    student_photo: null,
    position: "Head Boy",
    class_name: "P6",
    stream_name: "Bronze",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C09",
    student_name: "Peter K.",
    student_email: "peter.k@glorious.edu.ug",
    student_photo: null,
    position: "Head Boy",
    class_name: "P5",
    stream_name: "Gold",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C10",
    student_name: "James L.",
    student_email: "james.l@glorious.edu.ug",
    student_photo: null,
    position: "Head Boy",
    class_name: "P5",
    stream_name: "Silver",
    sex: "Male",
    status: "confirmed"
  },
  // Sports Captain - 5 candidates
  {
    id: "C11",
    student_name: "Brian L.",
    student_email: "brian.l@glorious.edu.ug",
    student_photo: null,
    position: "Sports Captain",
    class_name: "P5",
    stream_name: "Gold",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C12",
    student_name: "Emma R.",
    student_email: "emma.r@glorious.edu.ug",
    student_photo: null,
    position: "Sports Captain",
    class_name: "P5",
    stream_name: "Silver",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C13",
    student_name: "David S.",
    student_email: "david.s@glorious.edu.ug",
    student_photo: null,
    position: "Sports Captain",
    class_name: "P5",
    stream_name: "Bronze",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C14",
    student_name: "Sarah P.",
    student_email: "sarah.p@glorious.edu.ug",
    student_photo: null,
    position: "Sports Captain",
    class_name: "P4",
    stream_name: "Gold",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C15",
    student_name: "Kevin N.",
    student_email: "kevin.n@glorious.edu.ug",
    student_photo: null,
    position: "Sports Captain",
    class_name: "P4",
    stream_name: "Silver",
    sex: "Male",
    status: "confirmed"
  },
  // Academic Prefect - 5 candidates
  {
    id: "C16",
    student_name: "Michael O.",
    student_email: "michael.o@glorious.edu.ug",
    student_photo: null,
    position: "Academic Prefect",
    class_name: "P6",
    stream_name: "Gold",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C17",
    student_name: "Jane D.",
    student_email: "jane.d@glorious.edu.ug",
    student_photo: null,
    position: "Academic Prefect",
    class_name: "P5",
    stream_name: "Silver",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C18",
    student_name: "Robert K.",
    student_email: "robert.k@glorious.edu.ug",
    student_photo: null,
    position: "Academic Prefect",
    class_name: "P6",
    stream_name: "Bronze",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C19",
    student_name: "Linda M.",
    student_email: "linda.m@glorious.edu.ug",
    student_photo: null,
    position: "Academic Prefect",
    class_name: "P5",
    stream_name: "Gold",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C20",
    student_name: "Steven W.",
    student_email: "steven.w@glorious.edu.ug",
    student_photo: null,
    position: "Academic Prefect",
    class_name: "P5",
    stream_name: "Silver",
    sex: "Male",
    status: "confirmed"
  },
  // Entertainment Prefect - 5 candidates
  {
    id: "C21",
    student_name: "Paul N.",
    student_email: "paul.n@glorious.edu.ug",
    student_photo: null,
    position: "Entertainment Prefect",
    class_name: "P4",
    stream_name: "Gold",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C22",
    student_name: "Lucy K.",
    student_email: "lucy.k@glorious.edu.ug",
    student_photo: null,
    position: "Entertainment Prefect",
    class_name: "P4",
    stream_name: "Silver",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C23",
    student_name: "Mark B.",
    student_email: "mark.b@glorious.edu.ug",
    student_photo: null,
    position: "Entertainment Prefect",
    class_name: "P4",
    stream_name: "Bronze",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C24",
    student_name: "Alice R.",
    student_email: "alice.r@glorious.edu.ug",
    student_photo: null,
    position: "Entertainment Prefect",
    class_name: "P3",
    stream_name: "Gold",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C25",
    student_name: "Daniel T.",
    student_email: "daniel.t@glorious.edu.ug",
    student_photo: null,
    position: "Entertainment Prefect",
    class_name: "P3",
    stream_name: "Silver",
    sex: "Male",
    status: "confirmed"
  },
  // Discipline Prefect - 5 candidates
  {
    id: "C26",
    student_name: "David M.",
    student_email: "david.m@glorious.edu.ug",
    student_photo: null,
    position: "Discipline Prefect",
    class_name: "P5",
    stream_name: "Gold",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C27",
    student_name: "Grace A.",
    student_email: "grace.a@glorious.edu.ug",
    student_photo: null,
    position: "Discipline Prefect",
    class_name: "P5",
    stream_name: "Silver",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C28",
    student_name: "Patrick L.",
    student_email: "patrick.l@glorious.edu.ug",
    student_photo: null,
    position: "Discipline Prefect",
    class_name: "P5",
    stream_name: "Bronze",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C29",
    student_name: "Jennifer O.",
    student_email: "jennifer.o@glorious.edu.ug",
    student_photo: null,
    position: "Discipline Prefect",
    class_name: "P4",
    stream_name: "Gold",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C30",
    student_name: "Charles N.",
    student_email: "charles.n@glorious.edu.ug",
    student_photo: null,
    position: "Discipline Prefect",
    class_name: "P4",
    stream_name: "Silver",
    sex: "Male",
    status: "confirmed"
  },
  // Health & Sanitation - 5 candidates
  {
    id: "C31",
    student_name: "Samuel T.",
    student_email: "samuel.t@glorious.edu.ug",
    student_photo: null,
    position: "Health & Sanitation",
    class_name: "P4",
    stream_name: "Gold",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C32",
    student_name: "Mary W.",
    student_email: "mary.w@glorious.edu.ug",
    student_photo: null,
    position: "Health & Sanitation",
    class_name: "P4",
    stream_name: "Silver",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C33",
    student_name: "Francis K.",
    student_email: "francis.k@glorious.edu.ug",
    student_photo: null,
    position: "Health & Sanitation",
    class_name: "P4",
    stream_name: "Bronze",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C34",
    student_name: "Rose M.",
    student_email: "rose.m@glorious.edu.ug",
    student_photo: null,
    position: "Health & Sanitation",
    class_name: "P3",
    stream_name: "Gold",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C35",
    student_name: "Henry D.",
    student_email: "henry.d@glorious.edu.ug",
    student_photo: null,
    position: "Health & Sanitation",
    class_name: "P3",
    stream_name: "Silver",
    sex: "Male",
    status: "confirmed"
  },
  // Time Keeper - 5 candidates
  {
    id: "C36",
    student_name: "Joseph K.",
    student_email: "joseph.k@glorious.edu.ug",
    student_photo: null,
    position: "Time Keeper",
    class_name: "P5",
    stream_name: "Gold",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C37",
    student_name: "Rebecca N.",
    student_email: "rebecca.n@glorious.edu.ug",
    student_photo: null,
    position: "Time Keeper",
    class_name: "P5",
    stream_name: "Silver",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C38",
    student_name: "Andrew P.",
    student_email: "andrew.p@glorious.edu.ug",
    student_photo: null,
    position: "Time Keeper",
    class_name: "P5",
    stream_name: "Bronze",
    sex: "Male",
    status: "confirmed"
  },
  {
    id: "C39",
    student_name: "Betty S.",
    student_email: "betty.s@glorious.edu.ug",
    student_photo: null,
    position: "Time Keeper",
    class_name: "P4",
    stream_name: "Gold",
    sex: "Female",
    status: "confirmed"
  },
  {
    id: "C40",
    student_name: "George H.",
    student_email: "george.h@glorious.edu.ug",
    student_photo: null,
    position: "Time Keeper",
    class_name: "P4",
    stream_name: "Silver",
    sex: "Male",
    status: "confirmed"
  }
];
