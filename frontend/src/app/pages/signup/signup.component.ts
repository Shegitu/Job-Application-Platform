import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  form: FormGroup;
  isSubmitting = false;
  isExtracting = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      location: ['', Validators.required]
    });
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

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.signup(this.form.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/experience']);
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 400) {
          this.errorMessage = 'Please check your information and try again.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      }
    });
  }
}