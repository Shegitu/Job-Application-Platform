import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Job, ApplyToJobRequest, ApplyToJobResponse, MyApplication } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class JobService {
  private baseUrl = 'https://localhost:5001/api/jobs';
  private readonly tokenKey = 'jobplatform_userToken';

  constructor(private http: HttpClient) {}

  private jobsSubject = new BehaviorSubject<Job[] | null>(null);
  public jobs$ = this.jobsSubject.asObservable();

  // Load jobs from server and emit to subscribers
  loadJobs(): void {
    this.getJobs().subscribe({
      next: (jobs) => this.jobsSubject.next(jobs),
      error: () => {}
    });
  }

  private authHeaders(): HttpHeaders {
    const token = sessionStorage.getItem(this.tokenKey) ?? '';
    return new HttpHeaders({ 'X-User-Token': token });
  }

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.baseUrl);
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.baseUrl}/${id}`);
  }

  applyToJob(jobId: number, request: ApplyToJobRequest): Observable<ApplyToJobResponse> {
    return this.http.post<ApplyToJobResponse>(`${this.baseUrl}/${jobId}/apply`, request, { headers: this.authHeaders() });
  }

  getMyApplications(): Observable<MyApplication[]> {
    return this.http.get<MyApplication[]>(`${this.baseUrl}/mine`, { headers: this.authHeaders() });
  }
}