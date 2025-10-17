// ===== Sample Form Configurations =====
// frontend/src/data/sampleForms.js

export const sampleForms = [
  {
    form: {
      id: "form_1234567890",
      title: "Employee Onboarding Form",
      description: "Please fill out this form to complete your onboarding process.",
      submitText: "Submit Application",
      successMessage: "Thank you for completing the onboarding form!",
      fields: [
        {
          id: "field_001",
          type: "section",
          label: "Personal Information",
          name: "section_personal"
        },
        {
          id: "field_002",
          type: "text",
          label: "First Name",
          name: "firstName",
          required: true,
          placeholder: "Enter your first name",
          helpText: "Legal first name as shown on ID"
        },
        {
          id: "field_003",
          type: "text",
          label: "Last Name",
          name: "lastName",
          required: true,
          placeholder: "Enter your last name",
          helpText: "Legal last name as shown on ID"
        },
        {
          id: "field_004",
          type: "email",
          label: "Email Address",
          name: "email",
          required: true,
          placeholder: "john.doe@example.com",
          helpText: "We'll use this for all communications"
        },
        {
          id: "field_005",
          type: "phone",
          label: "Phone Number",
          name: "phone",
          required: true,
          placeholder: "+1 (555) 000-0000",
          helpText: "Include country code"
        },
        {
          id: "field_006",
          type: "date",
          label: "Date of Birth",
          name: "dateOfBirth",
          required: true,
          helpText: "Must be 18 years or older"
        },
        {
          id: "field_007",
          type: "select",
          label: "Gender",
          name: "gender",
          required: false,
          options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
            { value: "prefer_not_say", label: "Prefer not to say" }
          ]
        },
        {
          id: "field_008",
          type: "section",
          label: "Address Information",
          name: "section_address"
        },
        {
          id: "field_009",
          type: "textarea",
          label: "Street Address",
          name: "streetAddress",
          required: true,
          placeholder: "Enter your full street address",
          rows: 3
        },
        {
          id: "field_010",
          type: "text",
          label: "City",
          name: "city",
          required: true,
          placeholder: "Enter city"
        },
        {
          id: "field_011",
          type: "text",
          label: "State/Province",
          name: "state",
          required: true,
          placeholder: "Enter state or province"
        },
        {
          id: "field_012",
          type: "text",
          label: "Postal Code",
          name: "postalCode",
          required: true,
          placeholder: "12345"
        },
        {
          id: "field_013",
          type: "select",
          label: "Country",
          name: "country",
          required: true,
          options: [
            { value: "us", label: "United States" },
            { value: "ca", label: "Canada" },
            { value: "uk", label: "United Kingdom" },
            { value: "au", label: "Australia" },
            { value: "other", label: "Other" }
          ]
        },
        {
          id: "field_014",
          type: "section",
          label: "Employment Details",
          name: "section_employment"
        },
        {
          id: "field_015",
          type: "select",
          label: "Department",
          name: "department",
          required: true,
          options: [
            { value: "engineering", label: "Engineering" },
            { value: "marketing", label: "Marketing" },
            { value: "sales", label: "Sales" },
            { value: "hr", label: "Human Resources" },
            { value: "finance", label: "Finance" },
            { value: "operations", label: "Operations" }
          ]
        },
        {
          id: "field_016",
          type: "text",
          label: "Job Title",
          name: "jobTitle",
          required: true,
          placeholder: "e.g., Senior Software Engineer"
        },
        {
          id: "field_017",
          type: "date",
          label: "Start Date",
          name: "startDate",
          required: true,
          helpText: "Your first day of work"
        },
        {
          id: "field_018",
          type: "radio",
          label: "Employment Type",
          name: "employmentType",
          required: true,
          options: [
            { value: "full_time", label: "Full Time" },
            { value: "part_time", label: "Part Time" },
            { value: "contract", label: "Contract" },
            { value: "internship", label: "Internship" }
          ]
        },
        {
          id: "field_019",
          type: "number",
          label: "Years of Experience",
          name: "yearsExperience",
          required: false,
          min: 0,
          max: 50,
          placeholder: "0"
        },
        {
          id: "field_020",
          type: "section",
          label: "Additional Information",
          name: "section_additional"
        },
        {
          id: "field_021",
          type: "checkbox",
          label: "Skills",
          name: "skills",
          required: false,
          options: [
            { value: "javascript", label: "JavaScript" },
            { value: "python", label: "Python" },
            { value: "java", label: "Java" },
            { value: "react", label: "React" },
            { value: "nodejs", label: "Node.js" },
            { value: "sql", label: "SQL" }
          ],
          helpText: "Select all that apply"
        },
        {
          id: "field_022",
          type: "rating",
          label: "How excited are you to join our team?",
          name: "excitement",
          required: false,
          maxRating: 5
        },
        {
          id: "field_023",
          type: "range",
          label: "Expected Salary Range (in thousands)",
          name: "salaryExpectation",
          required: false,
          min: 30,
          max: 200,
          step: 5
        },
        {
          id: "field_024",
          type: "file",
          label: "Upload Resume",
          name: "resume",
          required: true,
          fileOptions: {
            accept: ".pdf,.doc,.docx",
            maxSize: 5,
            multiple: false
          },
          helpText: "PDF or Word document, max 5MB"
        },
        {
          id: "field_025",
          type: "url",
          label: "LinkedIn Profile",
          name: "linkedin",
          required: false,
          placeholder: "https://linkedin.com/in/yourprofile"
        },
        {
          id: "field_026",
          type: "color",
          label: "Favorite Color",
          name: "favoriteColor",
          required: false,
          helpText: "Just for fun!"
        },
        {
          id: "field_027",
          type: "textarea",
          label: "Tell us about yourself",
          name: "about",
          required: false,
          placeholder: "Share anything you'd like us to know...",
          rows: 5,
          helpText: "Optional: Hobbies, interests, fun facts"
        },
        {
          id: "field_028",
          type: "time",
          label: "Preferred Start Time",
          name: "preferredStartTime",
          required: false,
          helpText: "When do you prefer to start your workday?"
        }
      ]
    }
  },
  {
    form: {
      id: "form_survey_001",
      title: "Customer Satisfaction Survey",
      description: "Help us improve our services by sharing your feedback.",
      submitText: "Submit Survey",
      successMessage: "Thank you for your feedback!",
      fields: [
        {
          id: "survey_001",
          type: "text",
          label: "Full Name",
          name: "customerName",
          required: true,
          placeholder: "Enter your name"
        },
        {
          id: "survey_002",
          type: "email",
          label: "Email",
          name: "customerEmail",
          required: true,
          placeholder: "your@email.com"
        },
        {
          id: "survey_003",
          type: "rating",
          label: "Overall Satisfaction",
          name: "overallSatisfaction",
          required: true,
          maxRating: 10,
          helpText: "Rate from 1 (Very Unsatisfied) to 10 (Very Satisfied)"
        },
        {
          id: "survey_004",
          type: "radio",
          label: "How likely are you to recommend us?",
          name: "recommendation",
          required: true,
          options: [
            { value: "very_likely", label: "Very Likely" },
            { value: "likely", label: "Likely" },
            { value: "neutral", label: "Neutral" },
            { value: "unlikely", label: "Unlikely" },
            { value: "very_unlikely", label: "Very Unlikely" }
          ]
        },
        {
          id: "survey_005",
          type: "checkbox",
          label: "Which features do you use most?",
          name: "features",
          required: false,
          options: [
            { value: "dashboard", label: "Dashboard" },
            { value: "reports", label: "Reports" },
            { value: "analytics", label: "Analytics" },
            { value: "collaboration", label: "Collaboration" },
            { value: "automation", label: "Automation" }
          ]
        },
        {
          id: "survey_006",
          type: "textarea",
          label: "Additional Comments",
          name: "comments",
          required: false,
          placeholder: "Share your thoughts...",
          rows: 4
        }
      ]
    }
  }
];