import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeService } from '../../services/resume.service';
import { ApplicationService } from '../../services/application.service';

type UploadStatus = 'idle' | 'uploading' | 'uploaded' | 'processing' | 'completed' | 'failed';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent {
  selectedFile: File | null = null;
  status: UploadStatus = 'idle';
  errorMessage = '';
  resumeId: number | null = null;
  extractedLanguages: string[] = [];
  selectedLanguages: string[] = [];
  isSubmitting = false;

  constructor(
    private resumeService: ResumeService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.errorMessage = '';

    if (!this.resumeService.isValidFile(file)) {
      this.errorMessage = 'Please upload a PDF or Word document under 5MB.';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please choose a resume file first.';
      return;
    }

    const userId = this.applicationService.getCurrentUserId();
    if (!userId) {
      this.errorMessage = 'Please complete sign up first.';
      return;
    }

    this.status = 'uploading';
    this.errorMessage = '';

    this.resumeService.upload(userId, this.selectedFile).subscribe({
      next: (result) => {
        this.status = 'uploaded';
        this.resumeId = result.id;
        this.processResume();
      },
      error: () => {
        this.status = 'failed';
        this.errorMessage = 'Upload failed. Please try again.';
      }
    });
  }

  private processResume(): void {
    if (!this.resumeId) {
      return;
    }

    this.status = 'processing';

    this.resumeService.getExtractedLanguages(this.resumeId).subscribe({
      next: (result) => {
        this.extractedLanguages = result.extractedLanguages;
        this.status = 'completed';
      },
      error: () => {
        this.status = 'failed';
        this.errorMessage = 'Could not process the resume. Please try again.';
      }
    });
  }

  onLanguagesChanged(languages: string[]): void {
    this.selectedLanguages = languages;
  }

  onBack(): void {
    this.router.navigate(['/experience']);
  }

  onSubmit(): void {
    if (this.selectedLanguages.length === 0) {
      this.errorMessage = 'Please select at least one language.';
      return;
    }

    const userId = this.applicationService.getCurrentUserId();
    if (!userId || !this.resumeId) {
      this.errorMessage = 'Something is missing. Please restart the application.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const request = {
      userId,
      resumeId: this.resumeId,
      languages: this.selectedLanguages
    };

    this.applicationService.submitApplication(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 400) {
          this.errorMessage = 'Please check your application details.';
        } else {
          this.errorMessage = 'Submission failed. Please try again.';
        }
      }
    });
  }
}