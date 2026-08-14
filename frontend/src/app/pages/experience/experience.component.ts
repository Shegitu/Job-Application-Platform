import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { FormInputComponent } from '../../components/form-input/form-input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { StepHeaderComponent } from '../../components/step-header/step-header.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, FormInputComponent, ButtonComponent, StepHeaderComponent],
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
    if (!this.applicationService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    this.form = this.fb.group({
      yearsOfExperience: [0, [Validators.required, Validators.min(0)]],
      role: ['', Validators.required],
      description: ['']
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

    this.isSubmitting = true;
    this.errorMessage = '';

    this.applicationService.saveExperience(this.form.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/resume']);
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 401) {
          this.errorMessage = 'Session expired. Please log in again.';
        } else if (err.status === 400) {
          this.errorMessage = 'Please check your experience details.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      }
    });
  }
}