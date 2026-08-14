import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { ApplicationService } from '../../services/application.service';
import { ProfileResponse } from '../../models/user.model';
import { MyApplication } from '../../models/job.model';
import { Announcement } from '../../models/announcement.model';
import { AnnouncementService } from '../../services/announcement.service';
import { FormInputComponent } from '../../components/form-input/form-input.component';
import { ButtonComponent } from '../../components/button/button.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ReactiveFormsModule, FormInputComponent, ButtonComponent, JobCardComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  profile: ProfileResponse | null = null;
  applications: MyApplication[] = [];
  announcements: Announcement[] = [];
  jobs: Job[] = [];
  isLoading = true;
  errorMessage = '';

  isEditingProfile = false;
  profileForm: FormGroup;
  isSavingProfile = false;
  profileSuccessMessage = '';

  constructor(
    private authService: AuthService,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private announcementService: AnnouncementService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      location: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  get isLoggedIn(): boolean {
    return this.applicationService.isLoggedIn();
  }

  get decidedApplications(): MyApplication[] {
    return this.applications.filter(a => a.status !== 'Pending');
  }

  ngOnInit(): void {
    if (!this.applicationService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadProfile();
    this.loadApplications();
    this.loadAnnouncements();
    // subscribe to job updates and request initial load
    this.jobService.jobs$.subscribe(j => { if (j) this.jobs = j; });
    this.jobService.loadJobs();
  }

  loadJobs(): void {
    // kept for backwards compatibility — prefer jobs$ subscription
    this.jobService.getJobs().subscribe({
      next: (jobs) => { this.jobs = jobs; },
      error: () => { /* ignore errors here */ }
    });
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileForm.patchValue({
          name: profile.name,
          phone: profile.phone,
          location: profile.location,
          gender: profile.gender
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Could not load your profile.';
      }
    });
  }

  loadApplications(): void {
    this.jobService.getMyApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
      },
      error: () => {}
    });
  }

  loadAnnouncements(): void {
    this.announcementService.getAnnouncements().subscribe({
      next: (items) => { this.announcements = items; },
      error: () => { /* ignore if backend not present */ }
    });
  }

  toggleEditProfile(): void {
    this.isEditingProfile = !this.isEditingProfile;
    this.profileSuccessMessage = '';
  }

  onSaveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSavingProfile = true;

    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.isSavingProfile = false;
        this.profileSuccessMessage = 'Profile updated successfully.';
        this.isEditingProfile = false;
        this.loadProfile();
      },
      error: () => {
        this.isSavingProfile = false;
      }
    });
  }

  statusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  }

  hasApplied(jobId: number): boolean {
    return this.applications.some(a => a.jobId === jobId);
  }

  onApply(event: { jobId: number; coverLetter: string }): void {
    this.jobService.applyToJob(event.jobId, { coverLetter: event.coverLetter }).subscribe({
      next: () => {
        // mark as applied locally
        this.applications.push({ jobId: event.jobId, jobTitle: '', company: '', status: 'Pending', coverLetter: event.coverLetter } as any);
      },
      error: () => {}
    });
  }
}