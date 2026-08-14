import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Job } from '../../models/job.model';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, ButtonComponent, RouterLink, NgClass],
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css']
})
export class JobCardComponent {
  @Input() job!: Job;
  @Input() alreadyApplied = false;
  @Input() isLoggedIn = false;
  @Output() apply = new EventEmitter<{ jobId: number; coverLetter: string }>();

  showApplyForm = false;
  coverLetter = '';

  toggleApplyForm(): void {
    this.showApplyForm = !this.showApplyForm;
  }

  onSubmitApplication(): void {
    this.apply.emit({ jobId: this.job.id, coverLetter: this.coverLetter });
    this.showApplyForm = false;
    this.coverLetter = '';
  }
}