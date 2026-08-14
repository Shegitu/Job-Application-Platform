import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-resume-upload',
  standalone: true,
  imports: [NgIf, NgClass, ButtonComponent],
  templateUrl: './resume-upload.component.html',
  styleUrls: ['./resume-upload.component.css']
})
export class ResumeUploadComponent {
  @Input() selectedFile: File | null = null;
  @Input() status: string = 'idle';
  @Output() fileSelected = new EventEmitter<Event>();
  @Output() uploadClicked = new EventEmitter<void>();

  onFileChange(event: Event): void {
    this.fileSelected.emit(event);
  }

  onUploadClick(): void {
    this.uploadClicked.emit();
  }

  get statusLabel(): string {
    switch (this.status) {
      case 'uploading': return 'Uploading...';
      case 'uploaded': return 'Uploaded successfully';
      case 'processing': return 'Processing...';
      case 'completed': return 'Processing completed';
      case 'failed': return 'Upload failed';
      default: return '';
    }
  }
}