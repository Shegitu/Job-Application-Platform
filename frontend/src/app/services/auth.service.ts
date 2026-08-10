import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupRequest, User, EmailExtractResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://localhost:5001/api/auth';

  constructor(private http: HttpClient) {}

  signup(request: SignupRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/signup`, request);
  }

  extractFromEmail(email: string): Observable<EmailExtractResponse> {
    return this.http.post<EmailExtractResponse>(`${this.baseUrl}/extract`, { email });
  }
}