import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResumeUploadResponse, ExtractedLanguagesResponse } from '../models/resume.model';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private baseUrl = 'https://localhost:5001/api/resume';

  allowedTypes: string[] = ['application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  maxFileSizeBytes = 5 * 1024 * 1024;

  constructor(private http: HttpClient) {}

  isValidFile(file: File): boolean {
    return this.allowedTypes.includes(file.type) && file.size <= this.maxFileSizeBytes;
  }

  upload(userId: number, file: File): Observable<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('file', file);
    return this.http.post<ResumeUploadResponse>(`${this.baseUrl}/upload`, formData);
  }

  getExtractedLanguages(resumeId: number): Observable<ExtractedLanguagesResponse> {
    return this.http.get<ExtractedLanguagesResponse>(`${this.baseUrl}/${resumeId}/languages`);
  }
}