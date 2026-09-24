export type Track = "undergraduate" | "postgraduate" | "certificates" | "odl" | "international"

export interface ProgrammeInfo {
  title: string
  duration: string
  mode: string
  qualification: string
}

export interface TrackConfig {
  label: string 
  heroLabel: string              // shown in the hero eyebrow
  educationMode: "olevel" | "degree" 
  hasApplicantTypeStep: boolean  // only postgraduate asks "are you an EduNova graduate?"
  faculties: string[]
  departmentsByFaculty: Record<string, string[]>
  programmesByDept: Record<string, ProgrammeInfo>
  generalRequirements: string[]
  applicationRequirements: string[]
}

const engineeringDepts = [
  "Mechanical Engineering", "Civil Engineering", "Electrical & Electronics Engineering",
  "Chemical Engineering", "Mechatronics Engineering",
]
const computingDepts = ["Computer Science", "Software Engineering", "Artificial Intelligence", "Cybersecurity"]
const businessDepts = ["Accounting", "Marketing", "Business Administration", "Economics"]

const sharedFaculties = [
  "Faculty of Engineering & Technology",
  "Faculty of Computing & AI",
  "Faculty of Business & Management",
  "Faculty of Health Sciences",
]

const sharedDepartmentsByFaculty: Record<string, string[]> = {
  "Faculty of Engineering & Technology": engineeringDepts,
  "Faculty of Computing & AI": computingDepts,
  "Faculty of Business & Management": businessDepts,
  "Faculty of Health Sciences": ["Nursing", "Public Health", "Biomedical Sciences"],
}

export const trackConfigs: Record<Track, TrackConfig> = {
  undergraduate: {
    label: "Undergraduate",
    heroLabel: "Undergraduate Application",
    educationMode: "olevel",
    hasApplicantTypeStep: false,
    faculties: sharedFaculties,
    departmentsByFaculty: sharedDepartmentsByFaculty,
    programmesByDept: {
  // Faculty of Engineering & Technology
  "Mechanical Engineering": {
    title: "B.Eng. Mechanical Engineering",
    duration: "5 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Engineering",
  },
  "Civil Engineering": {
    title: "B.Eng. Civil Engineering",
    duration: "5 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Engineering",
  },
  "Electrical & Electronics Engineering": {
    title: "B.Eng. Electrical & Electronics Engineering",
    duration: "5 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Engineering",
  },
  "Chemical Engineering": {
    title: "B.Eng. Chemical Engineering",
    duration: "5 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Engineering",
  },
  "Mechatronics Engineering": {
    title: "B.Eng. Mechatronics Engineering",
    duration: "5 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Engineering",
  },

  // Faculty of Computing & AI
  "Computer Science": {
    title: "B.Sc. Computer Science",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
  "Software Engineering": {
    title: "B.Sc. Software Engineering",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
  "Artificial Intelligence": {
    title: "B.Sc. Artificial Intelligence",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
  "Cybersecurity": {
    title: "B.Sc. Cybersecurity",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },

  // Faculty of Business & Management
  "Accounting": {
    title: "B.Sc. Accounting",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
  "Marketing": {
    title: "B.Sc. Marketing",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
  "Business Administration": {
    title: "B.Sc. Business Administration",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
  "Economics": {
    title: "B.Sc. Economics",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },

  // Faculty of Health Sciences
  "Nursing": {
    title: "B.NSc. Nursing Science",
    duration: "5 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Nursing Science",
  },
  "Public Health": {
    title: "B.Sc. Public Health",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
  "Biomedical Sciences": {
    title: "B.Sc. Biomedical Sciences",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
},
    generalRequirements: [
      "Minimum of five relevant O'Level credits",
      "Mathematics and English Language required",
      "Relevant science subjects required",
    ],
    applicationRequirements: [
      "O'Level result", "Passport photograph", "Birth certificate / declaration of age",
      "Valid identification", "JAMB information, where applicable",
    ],
  },

  postgraduate: {
    label: "Postgraduate",
    heroLabel: "Postgraduate Application",
    educationMode: "degree",
    hasApplicantTypeStep: true,
    faculties: sharedFaculties,
    departmentsByFaculty: sharedDepartmentsByFaculty,
    programmesByDept: {
      "Mechanical Engineering": { title: "M.Sc. Mechanical Engineering", duration: "2 Years", mode: "Full-Time", qualification: "Master of Science" },
      "Computer Science": { title: "M.Sc. Computer Science", duration: "2 Years", mode: "Full-Time", qualification: "Master of Science" },
      "Business Administration": { title: "MBA", duration: "18 Months", mode: "Full-Time / Part-Time", qualification: "Master of Business Administration" },
      "Public Health": { title: "M.P.H. Public Health", duration: "2 Years", mode: "Full-Time", qualification: "Master of Public Health" },
    },
    generalRequirements: [
      "Minimum of Second Class Lower degree or equivalent",
      "Degree in a relevant field",
      "Minimum of 2 years work experience (programme-dependent)",
    ],
    applicationRequirements: [
      "Degree certificate", "Academic transcript", "Statement of purpose",
      "Two referee reports", "Valid identification",
    ],
  },

  certificates: {
    label: "Professional Certificate",
    heroLabel: "Professional Certificate Application",
    educationMode: "olevel",
    hasApplicantTypeStep: false,
    faculties: ["School of Computing & Digital Technologies", "School of Business & Entrepreneurship"],
    departmentsByFaculty: {
      "School of Computing & Digital Technologies": ["Data Analytics", "UI/UX Design", "Cloud Computing"],
      "School of Business & Entrepreneurship": ["Digital Marketing", "Project Management"],
    },
    programmesByDept: {
  // Faculty of Engineering & Technology
  "Mechanical Engineering": {
    title: "M.Sc. Mechanical Engineering",
    duration: "2 Years",
    mode: "Full-Time",
    qualification: "Master of Science",
  },
  "Civil Engineering": {
    title: "M.Sc. Civil Engineering",
    duration: "2 Years",
    mode: "Full-Time",
    qualification: "Master of Science",
  },
  "Electrical & Electronics Engineering": {
    title: "M.Sc. Electrical & Electronics Engineering",
    duration: "2 Years",
    mode: "Full-Time",
    qualification: "Master of Science",
  },
  "Chemical Engineering": {
    title: "M.Sc. Chemical Engineering",
    duration: "2 Years",
    mode: "Full-Time",
    qualification: "Master of Science",
  },
  "Mechatronics Engineering": {
    title: "M.Sc. Mechatronics Engineering",
    duration: "2 Years",
    mode: "Full-Time",
    qualification: "Master of Science",
  },

  // Faculty of Computing & AI
  "Computer Science": {
    title: "M.Sc. Computer Science",
    duration: "2 Years",
    mode: "Full-Time",
    qualification: "Master of Science",
  },
  "Software Engineering": {
    title: "M.Sc. Software Engineering",
    duration: "2 Years",
    mode: "Full-Time",
    qualification: "Master of Science",
  },
  "Artificial Intelligence": {
    title: "M.Sc. Artificial Intelligence",
    duration: "2 Years",
    mode: "Full-Time",
    qualification: "Master of Science",
  },
  "Cybersecurity": {
    title: "M.Sc. Cybersecurity",
    duration: "2 Years",
    mode: "Full-Time",
    qualification: "Master of Science",
  },

  // Faculty of Business & Management
  "Accounting": {
    title: "M.Sc. Accounting",
    duration: "2 Years",
    mode: "Full-Time",
    qualification: "Master of Science",
  },
  "Marketing": {
    title: "M.Sc. Marketing",
    duration: "2 Years",
    mode: "Full-Time",
    qualification: "Master of Science",
  },
  "Business Administration": {
    title: "MBA",
    duration: "18 Months",
    mode: "Full-Time / Part-Time",
    qualification: "Master of Business Administration",
  },
  "Economics": {
    title: "M.Sc. Economics",
    duration: "2 Years",
    mode: "Full-Time",
    qualification: "Master of Science",
  },

  // Faculty of Health Sciences
  "Nursing": {
    title: "M.Sc. Nursing Science",
    duration: "2 Years",
    mode: "Full-Time",
    qualification: "Master of Science",
  },
  "Public Health": {
    title: "M.P.H. Public Health",
    duration: "2 Years",
    mode: "Full-Time",
    qualification: "Master of Public Health",
  },
  "Biomedical Sciences": {
    title: "M.Sc. Biomedical Sciences",
    duration: "2 Years",
    mode: "Full-Time",
    qualification: "Master of Science",
  },
},
    generalRequirements: ["Minimum age of 16", "SSCE or equivalent"],
    applicationRequirements: ["Valid identification", "Passport photograph"],
  },

  odl: {
    label: "Open & Distance Learning",
    heroLabel: "Open & Distance Learning Application",
    educationMode: "olevel",
    hasApplicantTypeStep: false,
    faculties: ["School of Business", "School of Computing", "School of Education"],
    departmentsByFaculty: {
      "School of Business": ["Business Administration"],
      "School of Computing": ["Computer Science"],
      "School of Education": ["Educational Management"],
    },
    programmesByDept: {
      "Business Administration": { title: "B.Sc. Business Administration (ODL)", duration: "4 Years", mode: "Online", qualification: "Bachelor of Science" },
      "Computer Science": { title: "B.sc Computer Science (ODL)", duration: "4 Years", mode: "Online", qualification: "Bachelor of Science" },
    },
    generalRequirements: ["Minimum of five relevant O'Level credits", "Reliable internet access for online learning"],
    applicationRequirements: ["O'Level result", "Valid identification", "Passport photograph"],
  },

  international: {
    label: "International Programmes",
    heroLabel: "International Application",
    educationMode: "degree",
    hasApplicantTypeStep: false,
    faculties: sharedFaculties,
    departmentsByFaculty: sharedDepartmentsByFaculty,
    programmesByDept: {
  // Faculty of Engineering & Technology
  "Mechanical Engineering": {
    title: "B.Eng. Mechanical Engineering (International)",
    duration: "5 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Engineering",
  },
  "Civil Engineering": {
    title: "B.Eng. Civil Engineering (International)",
    duration: "5 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Engineering",
  },
  "Electrical & Electronics Engineering": {
    title: "B.Eng. Electrical & Electronics Engineering (International)",
    duration: "5 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Engineering",
  },
  "Chemical Engineering": {
    title: "B.Eng. Chemical Engineering (International)",
    duration: "5 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Engineering",
  },
  "Mechatronics Engineering": {
    title: "B.Eng. Mechatronics Engineering (International)",
    duration: "5 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Engineering",
  },

  // Faculty of Computing & AI
  "Computer Science": {
    title: "B.Sc. Computer Science (International)",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
  "Software Engineering": {
    title: "B.Sc. Software Engineering (International)",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
  "Artificial Intelligence": {
    title: "B.Sc. Artificial Intelligence (International)",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
  "Cybersecurity": {
    title: "B.Sc. Cybersecurity (International)",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },

  // Faculty of Business & Management
  "Accounting": {
    title: "B.Sc. Accounting (International)",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
  "Marketing": {
    title: "B.Sc. Marketing (International)",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
  "Business Administration": {
    title: "B.Sc. Business Administration (International)",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
  "Economics": {
    title: "B.Sc. Economics (International)",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },

  // Faculty of Health Sciences
  "Nursing": {
    title: "B.NSc. Nursing Science (International)",
    duration: "5 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Nursing Science",
  },
  "Public Health": {
    title: "B.Sc. Public Health (International)",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
  "Biomedical Sciences": {
    title: "B.Sc. Biomedical Sciences (International)",
    duration: "4 Years",
    mode: "Full-Time",
    qualification: "Bachelor of Science",
  },
},
    generalRequirements: ["Equivalent secondary or degree qualification", "English language proficiency where required"],
    applicationRequirements: ["Academic transcripts", "Passport", "Student visa documentation", "English proficiency result"],
  },
}

export function getProgramme(track: Track, department: string): ProgrammeInfo | null {
  return trackConfigs[track]?.programmesByDept[department] ?? null
}