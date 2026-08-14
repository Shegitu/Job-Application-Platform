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
  password: string;
  gender: string;
  phone: string;
  location: string;
}

export interface SignupResponse {
  id: number;
  name: string;
  email: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  token: string;
}

export interface EmailExtractResponse {
  name?: string;
  location?: string;
}
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
  password: string;
  gender: string;
  phone: string;
  location: string;
}

export interface SignupResponse {
  id: number;
  name: string;
  email: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  token: string;
}

export interface EmailExtractResponse {
  name?: string;
  location?: string;
}

export interface ProfileResponse {
  id: number;
  name: string;
  email: string;
  gender: string;
  phone: string;
  location: string;
  yearsOfExperience?: number;
  role?: string;
  experienceDescription?: string;
  resumeFileName?: string;
  languages: string[];
}

export interface UpdateProfileRequest {
  name: string;
  phone: string;
  location: string;
  gender: string;
}