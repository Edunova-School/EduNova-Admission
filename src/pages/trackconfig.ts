export type Track = "undergraduate" | "postgraduate" | "certificate" | "odl" | "international"

export interface ProgrammeInfo {
  title: string
  duration: string
  mode: string
  qualification: string
}

export interface TrackConfig {
  label: string                 // "Undergraduate", "Postgraduate", ...
  heroLabel: string              // shown in the hero eyebrow
  educationMode: "olevel" | "degree"   // which Education page section to show
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
      "Mechanical Engineering": { title: "B.Eng. Mechanical Engineering", duration: "5 Years", mode: "Full-Time", qualification: "Bachelor of Engineering" },
      "Civil Engineering": { title: "B.Eng. Civil Engineering", duration: "5 Years", mode: "Full-Time", qualification: "Bachelor of Engineering" },
      "Computer Science": { title: "B.Sc. Computer Science", duration: "4 Years", mode: "Full-Time", qualification: "Bachelor of Science" },
      "Business Administration": { title: "B.Sc. Business Administration", duration: "4 Years", mode: "Full-Time", qualification: "Bachelor of Science" },
      "Nursing": { title: "B.NSc. Nursing Science", duration: "5 Years", mode: "Full-Time", qualification: "Bachelor of Nursing Science" },
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

  certificate: {
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
      "Data Analytics": { title: "Certificate in Data Analytics", duration: "6 Months", mode: "Part-Time", qualification: "Professional Certificate" },
      "Digital Marketing": { title: "Certificate in Digital Marketing", duration: "3 Months", mode: "Part-Time", qualification: "Professional Certificate" },
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
      "Computer Science": { title: "B.Sc. Computer Science (ODL)", duration: "4 Years", mode: "Online", qualification: "Bachelor of Science" },
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
      "Computer Science": { title: "B.Sc. Computer Science (International)", duration: "4 Years", mode: "Full-Time", qualification: "Bachelor of Science" },
    },
    generalRequirements: ["Equivalent secondary or degree qualification", "English language proficiency where required"],
    applicationRequirements: ["Academic transcripts", "Passport", "Student visa documentation", "English proficiency result"],
  },
}

export function getProgramme(track: Track, department: string): ProgrammeInfo | null {
  return trackConfigs[track]?.programmesByDept[department] ?? null
}