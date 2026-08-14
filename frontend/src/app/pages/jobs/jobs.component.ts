import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { Job } from '../../models/job.model';
import { JobCardComponent } from '../../components/job-card/job-card.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [NgIf, NgFor, JobCardComponent, RouterLink],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  jobs: Job[] = [];
  appliedJobIds: Set<number> = new Set();
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  constructor(private jobService: JobService, private applicationService: ApplicationService) {}

  get isLoggedIn(): boolean {
    return this.applicationService.isLoggedIn();
  }

  ngOnInit(): void {
    this.loadJobs();
    if (this.isLoggedIn) {
      this.loadMyApplications();
    }
  }

  loadJobs(): void {
  this.isLoading = true;
  this.errorMessage = '';

  this.jobService.getJobs().subscribe({
    next: (jobs) => {
      this.jobs = jobs;
      this.isLoading = false;
    },
    error: (err) => {
      this.isLoading = false;
      if (err.status === 404) {
        this.errorMessage = 'No jobs found right now.';
      } else if (err.status === 0) {
        this.errorMessage = 'Could not connect to the server. Please make sure it is running.';
      } else {
        this.errorMessage = 'Could not load jobs. Please try again.';
      }
    }
  });
}
  loadMyApplications(): void {
    this.jobService.getMyApplications().subscribe({
      next: (applications) => {
        this.appliedJobIds = new Set(applications.map(a => a.jobId));
      },
      error: () => {}
    });
  }

  hasApplied(jobId: number): boolean {
    return this.appliedJobIds.has(jobId);
  }

  onApply(event: { jobId: number; coverLetter: string }): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.jobService.applyToJob(event.jobId, { coverLetter: event.coverLetter }).subscribe({
      next: () => {
        this.appliedJobIds.add(event.jobId);
        this.successMessage = 'Application submitted! Check your email for confirmation.';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Could not submit application.';
      }
    });
  }
}