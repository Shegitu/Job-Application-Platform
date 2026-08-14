import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {
  job: any = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.applicationService.isLoggedIn();
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.errorMessage = 'Invalid job id.'; this.isLoading = false; return; }
    this.jobService.getJobById(id).subscribe({
      next: (j) => { this.job = j; this.isLoading = false; },
      error: (err) => { this.errorMessage = err.error?.message || 'Could not load job.'; this.isLoading = false; }
    });
  }

  onApply(): void {
    if (!this.isLoggedIn) { this.router.navigate(['/login']); return; }
    // navigate to jobs list where apply form exists in card, or open modal - for now navigate to jobs
    this.router.navigate(['/jobs']);
  }
}
