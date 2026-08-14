import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SignupRequest, SignupResponse, LoginRequest, LoginResponse,
  EmailExtractResponse, ProfileResponse, UpdateProfileRequest
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://localhost:5001/api/auth';
  private readonly tokenKey = 'jobplatform_userToken';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = sessionStorage.getItem(this.tokenKey) ?? '';
    return new HttpHeaders({ 'X-User-Token': token });
  }

  signup(request: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.baseUrl}/signup`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request);
  }

  extractFromEmail(email: string): Observable<EmailExtractResponse> {
    return this.http.post<EmailExtractResponse>(`${this.baseUrl}/extract`, { email });
  }

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.baseUrl}/profile`, { headers: this.authHeaders() });
  }

  updateProfile(request: UpdateProfileRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/profile`, request, { headers: this.authHeaders() });
  }
}