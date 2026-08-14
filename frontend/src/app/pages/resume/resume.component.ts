import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ResumeService } from '../../services/resume.service';
import { ApplicationService } from '../../services/application.service';
import { StepHeaderComponent } from '../../components/step-header/step-header.component';
import { ResumeUploadComponent } from '../../components/resume-upload/resume-upload.component';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';
import { ButtonComponent } from '../../components/button/button.component';

type UploadStatus = 'idle' | 'uploading' | 'uploaded' | 'processing' | 'completed' | 'failed';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [NgIf, StepHeaderComponent, ResumeUploadComponent, LanguageSelectorComponent, ButtonComponent],
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
  isSaving = false;

  constructor(
    private resumeService: ResumeService,
    private applicationService: ApplicationService,
    private router: Router
  ) {
    if (!this.applicationService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

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

    this.status = 'uploading';
    this.errorMessage = '';

    this.resumeService.upload(this.selectedFile).subscribe({
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

  onSaveProfile(): void {
    if (this.selectedLanguages.length === 0) {
      this.errorMessage = 'Please select at least one language.';
      return;
    }

    if (!this.resumeId) {
      this.errorMessage = 'Something is missing. Please restart the application.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    this.resumeService.confirmLanguages(this.resumeId, { languages: this.selectedLanguages }).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        this.isSaving = false;
        if (err.status === 400) {
          this.errorMessage = 'Please check your language selection.';
        } else {
          this.errorMessage = 'Could not save your profile. Please try again.';
        }
      }
    });
  }
}