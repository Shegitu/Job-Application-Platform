import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent {
  form: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private router: Router
  ) {
    this.form = this.fb.group({
      yearsOfExperience: [0, [Validators.required, Validators.min(0)]],
      role: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onBack(): void {
    this.router.navigate(['/signup']);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userId = this.applicationService.getCurrentUserId();
    if (!userId) {
      this.errorMessage = 'Please complete sign up first.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const request = { ...this.form.value, userId };

    this.applicationService.saveExperience(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/resume']);
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 400) {
          this.errorMessage = 'Please check your experience details.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      }
    });
  }
}