import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResumeUploadResponse, ExtractedLanguagesResponse, ConfirmLanguagesRequest } from '../models/resume.model';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private baseUrl = 'https://localhost:5001/api/resume';
  private readonly tokenKey = 'jobplatform_userToken';

  allowedTypes: string[] = ['application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  maxFileSizeBytes = 5 * 1024 * 1024;

  constructor(private http: HttpClient) {}

  isValidFile(file: File): boolean {
    return this.allowedTypes.includes(file.type) && file.size <= this.maxFileSizeBytes;
  }

  private authHeaders(): HttpHeaders {
    const token = sessionStorage.getItem(this.tokenKey) ?? '';
    return new HttpHeaders({ 'X-User-Token': token });
  }

  upload(file: File): Observable<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ResumeUploadResponse>(`${this.baseUrl}/upload`, formData, { headers: this.authHeaders() });
  }

  getExtractedLanguages(resumeId: number): Observable<ExtractedLanguagesResponse> {
    return this.http.get<ExtractedLanguagesResponse>(`${this.baseUrl}/${resumeId}/languages`, { headers: this.authHeaders() });
  }

  confirmLanguages(resumeId: number, request: ConfirmLanguagesRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/${resumeId}/languages`, request, { headers: this.authHeaders() });
  }
}