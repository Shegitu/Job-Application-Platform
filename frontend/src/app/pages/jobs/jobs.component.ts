import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  jobs: Job[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit(): void {
    this.loadJobs();
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
        } else {
          this.errorMessage = 'Could not load jobs. Please try again.';
        }
      }
    });
  }
}