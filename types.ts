
export enum FundingType {
  FULL = 'Fully Funded',
  PARTIAL = 'Partially Funded'
}

export enum ApplicationStatus {
  PLANNING = 'Planning',
  IN_PROGRESS = 'In Progress',
  SUBMITTED = 'Submitted',
  INTERVIEW = 'Interview',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected'
}

export enum DocStatus {
  PENDING = 'Pending',
  OBTAINED = 'Obtained',
  UPLOADED = 'Uploaded'
}

export interface Document {
  id: string;
  name: string;
  description?: string;
  isReusable: boolean;
  status: DocStatus;
  deadline?: string; // Target date to get this specific doc
  fileUrl?: string;
}

export interface ScholarshipApplication {
  id: string;
  title: string;
  university: string;
  degreeLevel: 'Masters' | 'PhD';
  fundingType: FundingType;
  deadline: string;
  documents: Document[];
  status: ApplicationStatus;
  websiteUrl?: string;
  notes?: string;
  createdAt: string;
  reminderEnabled: boolean;
}

export interface UserSettings {
  cloudinaryCloudName?: string;
  cloudinaryUploadPreset?: string;
  emailReminderAddress?: string;
  useLocalStorage: boolean;
}
