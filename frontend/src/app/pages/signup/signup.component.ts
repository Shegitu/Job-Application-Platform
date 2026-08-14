import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application.service';
import { FormInputComponent } from '../../components/form-input/form-input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { StepHeaderComponent } from '../../components/step-header/step-header.component';

function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (!value) {
    return null;
  }
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);
  const hasMinLength = value.length >= 6;

  return hasUpper && hasLower && hasSpecial && hasMinLength ? null : { weakPassword: true };
}

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, FormInputComponent, ButtonComponent, StepHeaderComponent, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  form: FormGroup;
  isSubmitting = false;
  isExtracting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private applicationService: ApplicationService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: ['', Validators.required],
      name: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      location: ['', Validators.required]
    }, { validators: passwordsMatchValidator });
  }

  onEmailBlur(): void {
    const emailControl = this.form.get('email');
    if (!emailControl || emailControl.invalid || !emailControl.value) {
      return;
    }

    this.isExtracting = true;
    this.authService.extractFromEmail(emailControl.value).subscribe({
      next: (result) => {
        if (result.name && !this.form.get('name')?.value) {
          this.form.get('name')?.setValue(result.name);
        }
        if (result.location && !this.form.get('location')?.value) {
          this.form.get('location')?.setValue(result.location);
        }
        this.isExtracting = false;
      },
      error: () => {
        this.isExtracting = false;
      }
    });
  }

  get passwordError(): string {
    const control = this.form.get('password');
    if (control?.touched && control?.hasError('weakPassword')) {
      return 'Password must be at least 6 characters and include an uppercase letter, a lowercase letter, and a special character.';
    }
    if (control?.touched && control?.hasError('required')) {
      return 'Password is required.';
    }
    return '';
  }

  get confirmPasswordError(): string {
    if (this.form.get('confirmPassword')?.touched && this.form.hasError('passwordsMismatch')) {
      return 'Passwords do not match.';
    }
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { confirmPassword, ...signupPayload } = this.form.value;

    this.authService.signup(signupPayload).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.applicationService.setSession(result.id, result.token, result.name);
        this.router.navigate(['/experience']);
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 400) {
          this.errorMessage = err.error?.message || 'Please check your information and try again.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      }
    });
  }
}