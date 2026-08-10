import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-step-header',
  templateUrl: './step-header.component.html',
  styleUrls: ['./step-header.component.css']
})
export class StepHeaderComponent {
  @Input() currentStep = 1;
  @Input() totalSteps = 4;

  get steps(): number[] {
    return Array.from({ length: this.totalSteps }, (_, i) => i + 1);
  }
}