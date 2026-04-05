import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommitteeService } from '../committee.service';

@Component({
  selector: 'app-profile-setup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="page-area">
      <div class="pg-head">
        <h2>Council Onboarding</h2>
        <p>Initialize your committee profile to start operating.</p>
      </div>

      <div class="login-card" style="max-width: 800px; margin: 0 auto; animation: none;">
        <div class="sec-title">
          <h3><i class="fas fa-id-card"></i> Core Identity</h3>
        </div>

        <div class="input-group">
          <label>Committee Name</label>
          <input [(ngModel)]="profile.name" placeholder="e.g. ACM Student Chapter">
        </div>

        <div class="input-group">
          <label>Catchphrase / Short Description</label>
          <input [(ngModel)]="profile.description" placeholder="A brief, high-impact tagline">
        </div>

        <div class="input-group">
          <label>Detailed Mission (Long Description)</label>
          <textarea [(ngModel)]="profile.long_description" placeholder="Explain your committee's goals, history, and activities..."></textarea>
        </div>

        <div class="sec-title" style="margin-top: 40px;">
          <h3><i class="fas fa-share-nodes"></i> Digital Presence</h3>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div class="input-group">
            <label><i class="fab fa-instagram"></i> Instagram URL</label>
            <input [(ngModel)]="profile.instagram" placeholder="https://instagram.com/yourhandle">
          </div>
          <div class="input-group">
            <label><i class="fab fa-linkedin"></i> LinkedIn URL</label>
            <input [(ngModel)]="profile.linkedin" placeholder="https://linkedin.com/company/yourhandle">
          </div>
          <div class="input-group">
            <label><i class="fab fa-x-twitter"></i> Twitter/X URL</label>
            <input [(ngModel)]="profile.twitter" placeholder="https://x.com/yourhandle">
          </div>
          <div class="input-group">
            <label><i class="fas fa-envelope"></i> Contact Email</label>
            <input [(ngModel)]="profile.contact_info" placeholder="committee@example.com">
          </div>
        </div>

        <div class="sec-title" style="margin-top: 40px;">
          <h3><i class="fas fa-image"></i> Brand Assets</h3>
        </div>

        <div class="input-group">
          <label>Update Committee Logo</label>
          <div style="display: flex; align-items: center; gap: 20px;">
             <div *ngIf="profile.logo_url" [style.background-image]="'url(' + profile.logo_url + ')'" style="width: 60px; height: 60px; background-size: cover; border: 1px solid var(--border-light);"></div>
             <input type="file" (change)="onFileSelected($event)" accept="image/*" style="border: 1px dashed var(--border-light); padding: 2rem;">
          </div>
        </div>

        <div style="margin-top: 40px;">
          <button class="btn-pri fw" (click)="saveProfile()" [disabled]="loading">
            <i class="fas fa-save"></i> {{ loading ? 'SYNCING DATA...' : 'INITIALIZE PROFILE →' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CommitteeProfileSetupComponent implements OnInit {
  private committeeService = inject(CommitteeService);
  private router = inject(Router);

  profile: any = {
    name: '',
    description: '',
    long_description: '',
    contact_info: '',
    instagram: '',
    linkedin: '',
    twitter: ''
  };
  selectedFile: File | null = null;
  loading = false;

  ngOnInit() {
    this.fetchProfile();
  }

  fetchProfile() {
    this.committeeService.getMyProfile().subscribe({
      next: (res: any) => {
        if (res) this.profile = res;
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveProfile() {
    this.loading = true;
    const formData = new FormData();
    formData.append('name', this.profile.name);
    formData.append('description', this.profile.description || '');
    formData.append('long_description', this.profile.long_description || '');
    formData.append('contact_info', this.profile.contact_info || '');
    formData.append('instagram', this.profile.instagram || '');
    formData.append('linkedin', this.profile.linkedin || '');
    formData.append('twitter', this.profile.twitter || '');
    
    if (this.selectedFile) {
      formData.append('logo', this.selectedFile);
    }

    this.committeeService.saveProfile(formData).subscribe({
      next: () => {
        this.loading = false;
        alert('Profile sync complete!');
        this.router.navigate(['/committee/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        alert('Sync Error: ' + (err.error?.detail || 'Unknown network error'));
      }
    });
  }
}
