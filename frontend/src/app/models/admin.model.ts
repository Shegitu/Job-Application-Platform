export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
}

export interface AdminApplicationOverview {
  applicationId: number;
  jobId?: number;
  jobTitle: string;
  status: string;
  coverLetter?: string;
  submittedAt: string;
}

export interface AdminUserOverview {
  userId: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  yearsOfExperience?: number;
  role?: string;
  resumeFileName?: string;
  languages: string[];
  applications: AdminApplicationOverview[];
}

export interface CreateJobRequest {
  title: string;
  company: string;
  location: string;
  description: string;
  requiredLanguages: string[];
  deadline: string;
}

export interface DecideApplicationRequest {
  applicationId: number;
  decision: string;
  message: string;
}

export interface BulkDecideRequest {
  jobId: number | null;
  decision: string;
  message: string;
}

export interface BulkDecideResponse {
  updatedCount: number;
}