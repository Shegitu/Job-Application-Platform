export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requiredLanguages: string[];
  deadline?: string;
}

export interface ApplyToJobRequest {
  coverLetter?: string;
}

export interface ApplyToJobResponse {
  applicationId: number;
  status: string;
}

export interface MyApplication {
  applicationId: number;
  jobId: number;
  jobTitle: string;
  company: string;
  status: string;
  coverLetter?: string;
  decisionMessage?: string;
  submittedAt: string;
}