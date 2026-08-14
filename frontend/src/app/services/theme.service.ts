import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeKey = 'jobplatform_theme';

  init(): void {
    const saved = localStorage.getItem(this.themeKey) ?? 'light';
    this.apply(saved);
  }

  toggle(): void {
    const current = document.documentElement.getAttribute('data-theme') ?? 'light';
    const next = current === 'light' ? 'dark' : 'light';
    this.apply(next);
    localStorage.setItem(this.themeKey, next);
  }

  private apply(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  isDark(): boolean {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }
}