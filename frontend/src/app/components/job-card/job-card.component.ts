import { Component, Input } from '@angular/core';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css']
})
export class JobCardComponent {
  @Input() job!: Job;
}