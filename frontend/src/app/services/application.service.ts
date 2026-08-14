import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExperienceRequest, Experience } from '../models/experience.model';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private baseUrl = 'https://localhost:5001/api';
  private readonly userIdKey = 'jobplatform_userId';
  private readonly tokenKey = 'jobplatform_userToken';
  private readonly nameKey = 'jobplatform_userName';

  constructor(private http: HttpClient) {}

  setSession(userId: number, token: string, name: string): void {
    sessionStorage.setItem(this.userIdKey, userId.toString());
    sessionStorage.setItem(this.tokenKey, token);
    sessionStorage.setItem(this.nameKey, name);
  }

  getCurrentUserId(): number | null {
    const stored = sessionStorage.getItem(this.userIdKey);
    return stored ? Number(stored) : null;
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  getUserName(): string | null {
    return sessionStorage.getItem(this.nameKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearSession(): void {
    sessionStorage.removeItem(this.userIdKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.nameKey);
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ 'X-User-Token': this.getToken() ?? '' });
  }

  saveExperience(request: ExperienceRequest): Observable<Experience> {
    return this.http.post<Experience>(`${this.baseUrl}/experience`, request, { headers: this.authHeaders() });
  }
}