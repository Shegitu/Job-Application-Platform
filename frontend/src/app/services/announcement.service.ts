import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Announcement } from '../models/announcement.model';
import { AdminService } from './admin.service';

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  private baseUrl = 'https://localhost:5001/api';

  constructor(private http: HttpClient, private adminService: AdminService) {}

  getAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.baseUrl}/announcements`);
  }

  createAnnouncement(request: { title?: string; message: string; sendEmail?: boolean }) {
    const headers = new HttpHeaders({ 'X-Admin-Token': this.adminService.getToken() ?? '' });
    return this.http.post(`${this.baseUrl}/admin/announcements`, request, { headers });
  }

  createUserAnnouncement(request: { title?: string; message: string; targetUserId?: number; sendEmail?: boolean }) {
    const headers = new HttpHeaders({ 'X-Admin-Token': this.adminService.getToken() ?? '' });
    return this.http.post(`${this.baseUrl}/admin/announcements`, request, { headers });
  }
}
