export interface Experience {
  id?: number;
  userId: number;
  yearsOfExperience: number;
  role: string;
  description: string;
}

export interface ExperienceRequest {
  yearsOfExperience: number;
  role: string;
  description: string;
}