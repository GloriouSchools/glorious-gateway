import { Video, Curriculum } from "@/types/video";

export const curriculum: Curriculum = {
  "Baby Class": {
    "Maths": ["Counting 1-10", "Shapes", "Colours", "Sorting Objects", "Simple Patterns"],
    "Science": ["Our Body Parts", "Animals", "Weather", "Water", "Plants"],
    "English": ["Alphabet Sounds", "Simple Words", "Rhymes", "Picture Books", "Listening Skills"],
    "Social Studies": ["My Family", "My Friends", "School", "Community Helpers", "Transport"],
    "Art & Craft": ["Drawing Shapes", "Colouring", "Paper Folding", "Clay Moulding", "Simple Painting"]
  },
  "Middle Class": {
    "Maths": ["Counting 1-50", "Simple Addition", "Simple Subtraction", "Shapes & Patterns", "Time (Day & Night)"],
    "Science": ["Animals & Their Sounds", "Plants & Trees", "Weather & Seasons", "Healthy Habits", "Water & Air"],
    "English": ["Phonics", "Simple Sentences", "Picture Stories", "Basic Reading", "Naming Objects"],
    "Social Studies": ["My Family", "My School", "Food & Meals", "Transport", "Our Environment"],
    "Art & Craft": ["Cutting & Pasting", "Painting", "Simple Drawing", "Clay Modelling", "Craft Projects"]
  },
  "Top Class": {
    "Maths": ["Numbers 1-100", "Addition & Subtraction", "Simple Word Problems", "Shapes & Sizes", "Days of the Week"],
    "Science": ["Our Body", "Living Things", "Plants & Seeds", "Animals & Their Homes", "Weather & Climate"],
    "English": ["Phonics", "Basic Reading", "Simple Stories", "Writing Short Sentences", "Listening & Speaking"],
    "Social Studies": ["My Family & Relatives", "Neighbourhood", "People Around Us", "Transport & Communication", "Caring for the Environment"],
    "Art & Craft": ["Free Drawing", "Cutting & Sticking", "Creative Craft", "Colouring", "Paper Craft"]
  },
  "Primary Five": {
    "Maths": ["Set Concepts", "Patterns and Sequences", "Fractions", "Lines, Angles and Geometrical figures", "Data handling", "Time", "Money", "Length, Mass and Capacity", "Integers", "Algebra"],
    "Science": ["Keeping Poultry and Bees", "Measurement", "Components of the environment: The Soil", "Immunization", "The Digestive System", "Heat Energy", "Occupation in our community: Crop growing", "Bacteria and Fungi", "Types of Change - Biological, physical and chemical", "Keeping goats, sheep and pigs", "Food and Nutrition", "Primary Health Care and Family Care"],
    "English": ["VEHICLE REPAIR AND MAINTENANCE", "PRINT MEDIA", "TRAVELLING", "COMMUNICATION", "The Post Office", "The Telephone", "The Internet", "Nationalities", "Languages", "PEACE AND SECURITY", "SERVICES (BANKING)"],
    "Social Studies": ["Location of Uganda on the Map of East Africa", "Physical Features in Uganda", "Climate of Uganda", "Vegetation in Uganda", "Natural Resources in Uganda", "Foreign Influence in Uganda", "The Road to Independence", "Uganda as an Independent Nation", "The Government of Uganda", "Population, Size and Distribution"],
    "Religious Education": ["FAITH", "Christianity and Islam", "God's Word for Us", "We are the New People of God in the Spirit", "We are the Church", "Witness", "RELATIONSHIP WITH GOD", "HOPE", "Surat Al-Zilzala"]
  }
};

export const videoData: Video[] = [
  {
    title: "SERVICES (BANKING)",
    type: "youtube",
    src: "TLsSCTVIEao",
    thumbnail: "",
    category: "English",
    class: "Primary Five",
    topic: "SERVICES (BANKING)"
  },
  {
    title: "Introduction to Fractions",
    type: "youtube",
    src: "L0bM12hT8Qk",
    thumbnail: "",
    category: "Maths",
    class: "Primary Five",
    topic: "Fractions"
  },
  {
    title: "The Digestive System",
    type: "youtube",
    src: "Og5xAdC8EUI",
    thumbnail: "",
    category: "Science",
    class: "Primary Five",
    topic: "The Digestive System"
  },
  {
    title: "Counting 1-10 for Kids",
    type: "youtube",
    src: "DR-cfDsHCGA",
    thumbnail: "",
    category: "Maths",
    class: "Baby Class",
    topic: "Counting 1-10"
  },
  {
    title: "Learning Shapes",
    type: "youtube",
    src: "e_04ZrNroTo",
    thumbnail: "",
    category: "Maths",
    class: "Baby Class",
    topic: "Shapes"
  },
  {
    title: "The Alphabet Song",
    type: "youtube",
    src: "75p-N9YKqNo",
    thumbnail: "",
    category: "English",
    class: "Baby Class",
    topic: "Alphabet Sounds"
  }
];
