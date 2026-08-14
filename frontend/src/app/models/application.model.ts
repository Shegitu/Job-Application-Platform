export interface ApplicationRequest {
  userId: number;
  resumeId: number;
  languages: string[];
}

export interface ApplicationResponse {
  id: number;
  status: string;
}