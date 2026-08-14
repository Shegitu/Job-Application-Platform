import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ApplicationService } from '../../services/application.service';
import { ThemeService } from '../../services/theme.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent {
  currentUrl = '';
  constructor(
    private applicationService: ApplicationService,
    private themeService: ThemeService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((ev: any) => {
      this.currentUrl = ev.urlAfterRedirects ?? ev.url ?? '';
    });
  }


  get isLoggedIn(): boolean {
    return this.applicationService.isLoggedIn();
  }

  get userName(): string | null {
    return this.applicationService.getUserName();
  }

  get isAdminLoggedIn(): boolean {
    return this.adminService.isLoggedIn();
  }

  get isDark(): boolean {
    return this.themeService.isDark();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  onLogout(): void {
    if (this.isAdminLoggedIn) {
      this.adminService.clearToken();
      this.router.navigate(['/admin/login']);
      return;
    }

    this.applicationService.clearSession();
    this.router.navigate(['/']);
  }
}