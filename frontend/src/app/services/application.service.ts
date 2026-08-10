import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExperienceRequest, Experience } from '../models/experience.model';

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
}