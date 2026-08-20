/**
 * Samadhan API client contract stubs
 */

// Helper to simulate network latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_RESPONSES = {
  ration_card: {
    restatement: "Delay in processing and issuance of a new Ration Card or updating card members under the Public Distribution System (PDS).",
    solutions: [
      {
        title: "Track Application Status Online",
        description: "Visit your State Food & Civil Supplies portal and query your application ID to verify if verification is pending or card is printed."
      },
      {
        title: "Lodge Grievance with the District Supply Officer (DSO)",
        description: "Submit a formal written complaint regarding the delay to the DSO or Food Inspector at your local block office."
      },
      {
        title: "File an RTI Application to Food Inspector Office",
        description: "Inquire about the standard timeline for card dispatch, pending list of applicants, and daily progress logs for your application reference."
      }
    ],
    rtiEligible: true
  },
  pension: {
    restatement: "Interruption or administrative delay in receiving monthly pension disbursements (Old Age, Widow, or Disability schemes).",
    solutions: [
      {
        title: "Verify Bank Account & Aadhaar Seeding",
        description: "Confirm at your bank branch that Aadhaar-enabled payment systems (AEPS) and regular KYC updates are active for direct benefit transfers."
      },
      {
        title: "Submit Inquiry to Social Welfare Office",
        description: "Visit the local block or municipal office to check if your physical verification file is approved or flagged for corrections."
      },
      {
        title: "File an RTI for Pension Disbursal Records",
        description: "Request official records on block-level budget allocations, monthly disbursement logs, and pending verification backlogs."
      }
    ],
    rtiEligible: true
  },
  passport: {
    restatement: "Prolonged delay in passport processing, dispatch, or clearance of police verification status.",
    solutions: [
      {
        title: "Verify Status on Passport Seva Portal",
        description: "Log in to check if the passport status is marked as 'Verification Pending' or if there is a clarification required from the police station."
      },
      {
        title: "Visit the Regional Passport Office (RPO)",
        description: "Schedule a status inquiry visit or visit the RPO during public grievance hours to resolve printing or verification blocks."
      },
      {
        title: "File an RTI with Ministry of External Affairs",
        description: "Request the status of police verification reports, specific dates of processing, and details on delays beyond standard timeframes."
      }
    ],
    rtiEligible: true
  },
  general: {
    restatement: "Civic service delay or grievance concerning public utility/administrative processes.",
    solutions: [
      {
        title: "File a Grievance on State PG Portal or CPGRAMS",
        description: "Register a complaint online on your state's public grievance portal or the national CPGRAMS platform."
      },
      {
        title: "Contact the Public Relations Officer",
        description: "Submit a written representation to the designated Grievance / Public Relations Officer of the concerned department."
      },
      {
        title: "File a Right to Information (RTI) Query",
        description: "Request standard operating timelines, duty logs of the officers responsible, and current file movement history."
      }
    ],
    rtiEligible: true
  }
};

/**
 * Analyzes a civic or administrative problem and returns a restatement, solutions, and RTI eligibility.
 * @param {string} problem - Description of the issue.
 * @param {string} [category] - Optional category select.
 * @returns {Promise<{ restatement: string, solutions: { title: string, description: string }[], rtiEligible: boolean }>}
 */
export async function analyzeProblem(problem, category) {
  await delay(1500); // Simulate 1.5s network delay
  
  const text = (problem || "").toLowerCase();
  const cat = (category || "").toLowerCase();

  // Simulate occasional failure (15% rate or if description contains "fail")
  if (text.includes("fail") || Math.random() < 0.15) {
    throw new Error("Temporary network timeout: The database service failed to respond. Please check your connection and try again.");
  }

  if (cat.includes("ration") || text.includes("ration") || text.includes("food card") || text.includes("ration card")) {
    return MOCK_RESPONSES.ration_card;
  }
  if (cat.includes("pension") || text.includes("pension") || text.includes("old age") || text.includes("widow")) {
    return MOCK_RESPONSES.pension;
  }
  if (cat.includes("passport") || text.includes("passport") || text.includes("rpo") || text.includes("visa")) {
    return MOCK_RESPONSES.passport;
  }
  
  // Custom smart responses based on other categories
  if (cat.includes("land") || text.includes("land") || text.includes("patwari") || text.includes("property")) {
    return {
      restatement: "Dispute or delay in land records, property registry, or mutation entries managed by the Revenue Department.",
      solutions: [
        {
          title: "Verify Records on State Bhulekh Portal",
          description: "Access the online land records registry to see if land details, ownership logs, or mutation records are updated."
        },
        {
          title: "File an Appeal to the Tehsildar/Sub-Divisional Magistrate",
          description: "Submit a written application requesting verification or rectification of mutation entries."
        },
        {
          title: "File an RTI on Land Mutation Status",
          description: "Request copies of the field report, mutation files, and standard processing timelines for property registries."
        }
      ],
      rtiEligible: true
    };
  }

  if (cat.includes("police") || text.includes("police") || text.includes("fir") || text.includes("complaint")) {
    return {
      restatement: "Delay or refusal in registering an FIR, or lack of progress on a police complaint.",
      solutions: [
        {
          title: "Submit Grievance to the Superintendent of Police (SP)",
          description: "Under Section 154(3) CrPC, send a written complaint to the SP via registered post explaining the issue."
        },
        {
          title: "Approach the Judicial Magistrate",
          description: "If police inaction continues, file a private complaint under Section 156(3) CrPC in the local court."
        },
        {
          title: "File an RTI for Investigation Status",
          description: "Request certified copies of the case diary, progress report of the complaint, and details of action taken by the IO."
        }
      ],
      rtiEligible: true
    };
  }

  if (text.includes("water") || text.includes("jal board") || text.includes("contamination") || text.includes("scarcity")) {
    return {
      restatement: "Inconsistent drinking water supply or poor water quality under the local Water Supply Board.",
      solutions: [
        {
          title: "Submit Sample Report to Municipal Laboratory",
          description: "File a water contamination complaint at your ward's municipal lab to get a certified quality report."
        },
        {
          title: "Request Water Tanker Service",
          description: "Lodge an emergency request with the Water Board or municipal portal for localized tanker distribution."
        },
        {
          title: "File an RTI on Maintenance Budgets & Logs",
          description: "Request records of water filtration schedules, pipeline inspection logs, and repair budgets for your locality."
        }
      ],
      rtiEligible: true
    };
  }

  if (text.includes("streetlight") || text.includes("street light") || text.includes("darkness")) {
    return {
      restatement: "Non-functioning streetlights leading to safety and security hazards in the residential lane.",
      solutions: [
        {
          title: "Lodge Complaint on Civic Utility App",
          description: "Register a ticket on your local Municipal app (e.g. MCD 311) attaching the pole number and photos."
        },
        {
          title: "Submit Resident Petition to Ward Commissioner",
          description: "Draft and submit a ward-level petition signed by neighboring households requesting immediate repairs."
        },
        {
          title: "File an RTI on Maintenance Contracts",
          description: "Request the SLA contract details, penalty history of the streetlight maintenance vendor, and logs of last replacement."
        }
      ],
      rtiEligible: true
    };
  }

  if (text.includes("birth") || text.includes("death") || text.includes("certificate") || text.includes("registration")) {
    return {
      restatement: "Delay in registration or issuance of birth/death certificates by the local Registrar Office.",
      solutions: [
        {
          title: "Check Status on Civil Registration System Portal",
          description: "Ensure the hospital has uploaded the registration logs on the central CRS portal."
        },
        {
          title: "Submit Verification Form to Sub-Registrar",
          description: "Submit name correction forms along with certified hospital discharge details directly to the sub-registrar."
        },
        {
          title: "File an RTI on Application Processing Queues",
          description: "Inquire about standard processing timelines, pending backlogs, and names of officers responsible for clearing your batch."
        }
      ],
      rtiEligible: true
    };
  }

  if (text.includes("epf") || text.includes("pf ") || text.includes("provident") || text.includes("epfo")) {
    return {
      restatement: "Administrative delay in transfer, correction, or withdrawal settlement of Employees' Provident Fund (EPF).",
      solutions: [
        {
          title: "Register Grievance on EPFiGMS Portal",
          description: "Submit a claim dispute online on the EPFO grievance management portal using your UAN and claim ID."
        },
        {
          title: "Confirm Employer E-Sign Approval",
          description: "Ensure that your previous employer has digitally approved your transfer request on their EPFO employer portal."
        },
        {
          title: "File an RTI with Regional EPFO Commissioner",
          description: "Request the dates of file movement, reasons for claim rejection, and details of processing logs for your claim ID."
        }
      ],
      rtiEligible: true
    };
  }

  if (cat.includes("municipal") || text.includes("civic") || text.includes("road") || text.includes("garbage")) {
    return {
      restatement: "Municipal service failures such as drainage issues, local road repair delays, streetlights, or waste management.",
      solutions: [
        {
          title: "Lodge Complaint in Municipal App/Portal",
          description: "Submit a civic grievance on your local Municipal Corporation portal or mobile app with photos."
        },
        {
          title: "Contact the Ward Councillor / Commissioner",
          description: "Write to the Ward Commissioner or submit a petition to the local municipal ward office."
        },
        {
          title: "File an RTI on Fund Allocation and Project Timelines",
          description: "Request details on ward-level budget allocations, work orders issued, and names of contractors for local repairs."
        }
      ],
      rtiEligible: true
    };
  }

  // Fallback to general response
  return MOCK_RESPONSES.general;
}

/**
 * Drafts an RTI application.
 * @param {Object} payload
 * @param {string} payload.applicantName
 * @param {string} payload.applicantAddress
 * @param {string} payload.applicantContact
 * @param {string} payload.department
 * @param {string[]} payload.infoRequested
 * @returns {Promise<{ draftText: string }>}
 */
export async function draftRTI(payload) {
  await delay(1000);
  const now = new Date().toLocaleDateString('en-IN');
  const infoSought = (payload.infoRequested || [])
    .map((info, idx) => `   (${String.fromCharCode(97 + idx)}) ${info}`)
    .join("\n\n");
    
  const draftText = `To,
The Public Information Officer (PIO),
Office of: ${payload.department || "[Department/Office Name]"}

Subject: Application under Section 6(1) of the Right to Information Act, 2005.

1. Full Name of the Applicant: ${payload.applicantName || "[Applicant Name]"}
2. Complete Postal Address: ${payload.applicantAddress || "[Applicant Postal Address]"}
3. Contact Details: ${payload.applicantContact || "[Applicant Contact]"}

4. Particulars of Information Sought:
   I hereby request the following information:

${infoSought || "   (a) Please provide the current status and file movement records of my application/representation.\n\n   (b) Provide the standard operating timeline and citizens' charter policy for processing this category of requests."}

5. Citizenship Declaration:
   I hereby declare that I am a citizen of India and am eligible to seek information under the RTI Act, 2005.

6. Application Fee Payment:
   An application fee of Rs. 10/- (Rupees Ten Only) is attached/paid herewith via Indian Postal Order (IPO) / Demand Draft / Cash Receipt. (Instrument No: ______________________)

7. Information Delivery:
   Kindly dispatch the requested information/documents to my postal address listed above via Speed Post / Registered Post.

Date: ${now}
Place: ${payload.applicantPlace || "New Delhi"}

Sincerely,


__________________________________
Signature of the Applicant`;

  return { draftText };
}

/**
 * Saves a drafted RTI application.
 * @param {Object} payload
 * @param {string} payload.department
 * @param {string} payload.draftText
 * @returns {Promise<{ id: string, filedDate: string, dueDate: string }>}
 */
export async function saveRTI(payload) {
  await delay(1000);
  const now = new Date();
  const dueDate = new Date();
  dueDate.setDate(now.getDate() + 30); // 30 days default RTI timeline
  
  return {
    id: `RTI-${Math.floor(100000 + Math.random() * 900000)}`,
    filedDate: now.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0]
  };
}

/**
 * Lists previously drafted/filed RTI applications.
 * @returns {Promise<{ id: string, department: string, filedDate: string, dueDate: string, status: string }[]>}
 */
export async function listRTIs() {
  await delay(800);
  return [
    {
      id: "RTI-883921",
      department: "Food & Civil Supplies Department (Ration Delay)",
      filedDate: "2026-07-23", // 28 days ago
      dueDate: "2026-08-22",
      status: "Awaiting response"
    },
    {
      id: "RTI-109482",
      department: "EPFO Regional Office (Provident Fund)",
      filedDate: "2026-07-16", // 35 days ago (Overdue)
      dueDate: "2026-08-15",
      status: "Overdue — file appeal"
    },
    {
      id: "RTI-593021",
      department: "Regional Passport Office (Passport Delay)",
      filedDate: "2026-08-18", // 2 days ago
      dueDate: "2026-09-17",
      status: "Awaiting response"
    }
  ];
}
