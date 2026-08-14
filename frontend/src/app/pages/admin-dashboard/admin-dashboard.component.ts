import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { forkJoin } from 'rxjs';
import { JobService } from '../../services/job.service';
import { AnnouncementService } from '../../services/announcement.service';
import { AdminUserOverview, AdminApplicationOverview } from '../../models/admin.model';
import { Job } from '../../models/job.model';
import { FormInputComponent } from '../../components/form-input/form-input.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ReactiveFormsModule, FormsModule, FormInputComponent, ButtonComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: AdminUserOverview[] = [];
  allJobs: Job[] = [];
  isLoading = true;
  errorMessage = '';

  // Filters for selecting applicants by profile
  filterLocation = '';
  filterRole = '';
  filterLanguage = '';
  filterMinYears: number | null = null;
  filterJobId: number | null = null;

  includeAnnouncementForSelected = true;
  sendEmailForAnnouncement = false;

  jobForm: FormGroup;
  isPostingJob = false;
  jobSuccessMessage = '';

  decideForm: FormGroup;
  activeApplication: { userId: number; application: AdminApplicationOverview } | null = null;
  isDeciding = false;
  decideSuccessMessage = '';

  bulkForm: FormGroup;
  isSendingBulk = false;
  bulkSuccessMessage = '';

  selectedApplicationIds: Set<number> = new Set();
  multiDecision: 'Accepted' | 'Rejected' = 'Accepted';
  multiMessage = '';
  isSendingSelected = false;
  selectedSuccessMessage = '';

  announcementForm: FormGroup;
  isPostingAnnouncement = false;
  announcementSuccessMessage = '';

  constructor(
    private adminService: AdminService,
    private jobService: JobService,
    private announcementService: AnnouncementService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      requiredLanguages: [''],
      deadline: ['', Validators.required]
    });

    this.decideForm = this.fb.group({
      message: ['', Validators.required]
    });

    this.bulkForm = this.fb.group({
      jobId: [''],
      decision: ['Accepted', Validators.required],
      message: ['', Validators.required]
    });

    this.announcementForm = this.fb.group({
      title: [''],
      message: ['', Validators.required],
      sendEmail: [false]
    });
  }

  ngOnInit(): void {
    if (!this.adminService.isLoggedIn()) {
      this.router.navigate(['/admin/login']);
      return;
    }
    this.loadUsers();
    this.loadJobs();
  }

  toggleSelectApplication(applicationId: number, checked: boolean): void {
    if (checked) this.selectedApplicationIds.add(applicationId);
    else this.selectedApplicationIds.delete(applicationId);
  }

  sendDecisionToSelected(): void {
    if (this.selectedApplicationIds.size === 0) {
      this.selectedSuccessMessage = 'No applicants selected.';
      return;
    }

    if (!this.multiMessage || this.multiMessage.trim().length === 0) {
      this.selectedSuccessMessage = 'Please provide a message for applicants.';
      return;
    }

    this.isSendingSelected = true;
    const appIds = Array.from(this.selectedApplicationIds);
    const requests = appIds.map(id =>
      this.adminService.decideApplication({ applicationId: id, decision: this.multiDecision, message: this.multiMessage })
    );

    forkJoin(requests).subscribe({
      next: () => {
        // optionally create targeted announcements for each user
        if (this.includeAnnouncementForSelected && this.multiMessage && this.multiMessage.trim().length) {
          // find user ids for each application id
          const appToUser = new Map<number, number>();
          for (const u of this.users) {
            for (const a of u.applications) {
              appToUser.set(a.applicationId, u.userId);
            }
          }

          for (const aid of appIds) {
            const uid = appToUser.get(aid);
            if (uid) {
              const annReq: any = { title: `Application Update: ${this.multiDecision}`, message: this.multiMessage, targetUserId: uid, sendEmail: this.sendEmailForAnnouncement };
              this.announcementService.createUserAnnouncement(annReq).subscribe({ next: () => {}, error: () => {} });
            }
          }
        }

        this.isSendingSelected = false;
        this.selectedSuccessMessage = `Notified ${this.selectedApplicationIds.size} applicant(s).`;
        this.selectedApplicationIds.clear();
        this.multiMessage = '';
        this.loadUsers();
      },
      error: () => {
        this.isSendingSelected = false;
        this.selectedSuccessMessage = 'Failed to notify some applicants.';
      }
    });
  }

  // Select matching applicants based on profile filters
  selectMatchingApplicants(): void {
    this.selectedApplicationIds.clear();

    const jobIdFilter = this.filterJobId ? Number(this.filterJobId) : null;

    for (const u of this.users) {
      if (this.filterLocation && !u.location.toLowerCase().includes(this.filterLocation.toLowerCase())) continue;
      if (this.filterRole && !(u.role || '').toLowerCase().includes(this.filterRole.toLowerCase())) continue;
      if (this.filterMinYears !== null && ((u.yearsOfExperience ?? 0) < this.filterMinYears)) continue;
      // languages
      if (this.filterLanguage) {
        const langs = (u.languages || []).map(l => l.toLowerCase());
        if (!langs.some(l => l.includes(this.filterLanguage.toLowerCase()))) continue;
      }

      for (const a of u.applications) {
        if (a.status !== 'Pending') continue;
        if (jobIdFilter && a.jobId && Number(a.jobId) !== jobIdFilter) continue;
        this.selectedApplicationIds.add(a.applicationId);
      }
    }

    this.selectedSuccessMessage = `Selected ${this.selectedApplicationIds.size} matching applicant(s).`;
  }

  clearSelectedApplicants(): void {
    this.selectedApplicationIds.clear();
    this.selectedSuccessMessage = '';
  }

  onPostAnnouncement(): void {
    if (this.announcementForm.invalid) {
      this.announcementForm.markAllAsTouched();
      return;
    }

    this.isPostingAnnouncement = true;
    this.announcementSuccessMessage = '';

    const req = {
      title: this.announcementForm.value.title,
      message: this.announcementForm.value.message,
      sendEmail: this.announcementForm.value.sendEmail
    };

    // use AnnouncementService
    this.announcementService.createAnnouncement(req).subscribe({
      next: () => {
        this.isPostingAnnouncement = false;
        this.announcementSuccessMessage = 'Announcement posted.';
        this.announcementForm.reset({ sendEmail: false });
      },
      error: (err: any) => {
        this.isPostingAnnouncement = false;
        this.announcementSuccessMessage = err.error?.message || 'Failed to post announcement.';
      }
    });
  }

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Could not load users.';
      }
    });
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.allJobs = jobs;
      },
      error: () => {}
    });
  }

  onPostJob(): void {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    this.isPostingJob = true;
    this.jobSuccessMessage = '';

    const languages = (this.jobForm.value.requiredLanguages as string)
      .split(',')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const request = { ...this.jobForm.value, requiredLanguages: languages };

    this.adminService.createJob(request).subscribe({
      next: () => {
        this.isPostingJob = false;
        this.jobSuccessMessage = 'Job posted successfully.';
        this.jobForm.reset();
        this.loadJobs();
        // notify global job subscribers (user dashboards)
        this.jobService.loadJobs();
      },
      error: () => {
        this.isPostingJob = false;
        this.jobSuccessMessage = '';
      }
    });
  }

  openDecision(userId: number, application: AdminApplicationOverview): void {
    this.activeApplication = { userId, application };
    this.decideForm.reset();
    this.decideSuccessMessage = '';
  }

  closeDecision(): void {
    this.activeApplication = null;
  }

  onDecide(decision: 'Accepted' | 'Rejected'): void {
    if (this.decideForm.invalid || !this.activeApplication) {
      this.decideForm.markAllAsTouched();
      return;
    }

    this.isDeciding = true;

    const request = {
      applicationId: this.activeApplication.application.applicationId,
      decision,
      message: this.decideForm.value.message
    };

    this.adminService.decideApplication(request).subscribe({
      next: () => {
        this.isDeciding = false;
        this.decideSuccessMessage = `Applicant notified: ${decision}`;
        // capture user id before clearing activeApplication
        const targetUserId = this.activeApplication?.userId;
        if (this.activeApplication) {
          this.activeApplication.application.status = decision;
        }
        this.activeApplication = null;

        // also create a system announcement for the user so they see status in their dashboard
        if (targetUserId) {
          const annReq: any = { title: `Application Update: ${decision}`, message: request.message, targetUserId: targetUserId, sendEmail: false };
          this.announcementService.createUserAnnouncement(annReq).subscribe({ next: () => {}, error: () => {} });
        }
      },
      error: () => {
        this.isDeciding = false;
      }
    });
  }

  onSendBulkDecision(): void {
    if (this.bulkForm.invalid) {
      this.bulkForm.markAllAsTouched();
      return;
    }

    this.isSendingBulk = true;
    this.bulkSuccessMessage = '';

    const raw = this.bulkForm.value;
    const request = {
      jobId: raw.jobId ? Number(raw.jobId) : null,
      decision: raw.decision,
      message: raw.message
    };

    this.adminService.decideBulk(request).subscribe({
      next: (result) => {
        this.isSendingBulk = false;
        this.bulkSuccessMessage = `Updated and notified ${result.updatedCount} pending applicant(s).`;
        this.bulkForm.reset({ decision: 'Accepted' });
        this.loadUsers();
      },
      error: () => {
        this.isSendingBulk = false;
      }
    });
  }

  downloadResume(user: AdminUserOverview): void {
    if (!user.resumeFileName) {
      return;
    }

    this.adminService.downloadResume(user.userId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = user.resumeFileName!;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {}
    });
  }

  statusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  }

  onLogout(): void {
    this.adminService.clearToken();
    this.router.navigate(['/admin/login']);
  }
}