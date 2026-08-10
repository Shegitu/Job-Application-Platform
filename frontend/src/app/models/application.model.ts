export interface ApplicationRequest {
  userId: number;
  resumeId: number;
  languages: string[];
}

export interface ApplicationResponse {
  id: number;
  status: string;
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExperienceRequest, Experience } from '../models/experience.model';
import { ApplicationRequest, ApplicationResponse } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private baseUrl = 'https://localhost:5001/api';
  private currentUserId: number | null = null;

  constructor(private http: HttpClient) {}

  setCurrentUserId(id: number): void {
    this.currentUserId = id;
  }

  getCurrentUserId(): number | null {
    return this.currentUserId;
  }

  saveExperience(request: ExperienceRequest): Observable<Experience> {
    return this.http.post<Experience>(`${this.baseUrl}/experience`, request);
  }

  submitApplication(request: ApplicationRequest): Observable<ApplicationResponse> {
    return this.http.post<ApplicationResponse>(`${this.baseUrl}/application/submit`, request);
  }
}