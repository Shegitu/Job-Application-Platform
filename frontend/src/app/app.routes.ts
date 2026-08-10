import { Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { ExperienceComponent } from './pages/experience/experience.component';
import { ResumeComponent } from './pages/resume/resume.component';
import { JobsComponent } from './pages/jobs/jobs.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: 'resume', component: ResumeComponent },
  { path: 'jobs', component: JobsComponent },
  { path: '**', redirectTo: 'signup' }
];