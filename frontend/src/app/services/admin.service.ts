import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminUserOverview,
  CreateJobRequest,
  DecideApplicationRequest,
  BulkDecideRequest,
  BulkDecideResponse
} from '../models/admin.model';
import { Job } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = 'https://localhost:5001/api/admin';
  private readonly tokenKey = 'jobplatform_admin_token';

  constructor(private http: HttpClient) {}

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ 'X-Admin-Token': this.getToken() ?? '' });
  }

  login(request: AdminLoginRequest): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.baseUrl}/login`, request);
  }

  getUsers(): Observable<AdminUserOverview[]> {
    return this.http.get<AdminUserOverview[]>(`${this.baseUrl}/users`, { headers: this.authHeaders() });
  }

  createJob(request: CreateJobRequest): Observable<Job> {
    return this.http.post<Job>(`${this.baseUrl}/jobs`, request, { headers: this.authHeaders() });
  }

  decideApplication(request: DecideApplicationRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/applications/decide`, request, { headers: this.authHeaders() });
  }

  decideBulk(request: BulkDecideRequest): Observable<BulkDecideResponse> {
  return this.http.post<BulkDecideResponse>(`${this.baseUrl}/applications/decide-bulk`, request, { headers: this.authHeaders() });
}
  downloadResume(userId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/users/${userId}/resume`, {
      headers: this.authHeaders(),
      responseType: 'blob'
    });
  }
}