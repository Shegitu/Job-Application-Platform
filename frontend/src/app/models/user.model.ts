export interface User {
  id?: number;
  name: string;
  email: string;
  gender: string;
  phone: string;
  location: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  gender: string;
  phone: string;
  location: string;
}

export interface EmailExtractResponse {
  name?: string;
  location?: string;
}