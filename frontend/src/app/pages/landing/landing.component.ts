import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  constructor(private router: Router) {}

  onGetStarted(): void {
    this.router.navigate(['/signup']);
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }
}