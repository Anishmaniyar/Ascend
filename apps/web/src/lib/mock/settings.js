// Mock data for the Settings page.
// Replace with API calls later — shapes mirror the backend responses.

export const generalSettings = [
  {
    key: "displayName",
    label: "Display Name",
    icon: "user",
    value: "Anish",
    inputType: "text",
    description: "Change your display name.",
  },
  {
    key: "userId",
    label: "User ID",
    icon: "fingerprint",
    value: "anish_2026",
    inputType: "readonly",
    description: "Your unique account identifier.",
  },
  {
    key: "gender",
    label: "Gender",
    icon: "users",
    value: "",
    inputType: "select",
    options: ["Male", "Female", "Non-binary", "Prefer not to say"],
    description: "Select your gender.",
  },
  {
    key: "dateOfBirth",
    label: "Date of Birth",
    icon: "calendar",
    value: "",
    inputType: "date",
    description: "Your date of birth.",
  },
  {
    key: "location",
    label: "Location",
    icon: "mapPin",
    value: "Mumbai, India",
    inputType: "text",
    description: "Where you're based.",
  },
  {
    key: "websites",
    label: "Websites",
    icon: "globe",
    value: "",
    inputType: "url",
    description: "Your personal website or portfolio.",
  },
  {
    key: "github",
    label: "GitHub URL",
    icon: "github",
    value: "",
    inputType: "url",
    description: "Link your GitHub profile.",
  },
  {
    key: "linkedin",
    label: "LinkedIn URL",
    icon: "linkedin",
    value: "",
    inputType: "url",
    description: "Link your LinkedIn profile.",
  },
  {
    key: "leetcode",
    label: "LeetCode URL",
    icon: "code",
    value: "",
    inputType: "url",
    description: "Link your LeetCode profile.",
  },
  {
    key: "xId",
    label: "X @ID",
    icon: "atSign",
    value: "",
    inputType: "text",
    description: "Your X (Twitter) handle.",
  },
  {
    key: "bio",
    label: "Bio",
    icon: "fileText",
    value: "Final year CSE · targeting TCS & Infosys",
    inputType: "textarea",
    description: "Write a short bio about yourself.",
  },
];

export const experienceSettings = [
  // Placeholder — will be populated later.
];
