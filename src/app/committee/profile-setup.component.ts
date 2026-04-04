import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile-setup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="setup-container">
      <h2>Committee Profile Setup</h2>
      <p>Please complete your profile to start creating events.</p>
      
      <div class="form-group">
        <label>Committee Name</label>
        <input [(ngModel)]="profile.name" placeholder="e.g. Tech Club">
      </div>

      <div class="form-group">
        <label>Short Description</label>
        <input [(ngModel)]="profile.description" placeholder="A brief catchphrase">
      </div>

      <div class="form-group">
        <label>Long Description</label>
        <textarea [(ngModel)]="profile.long_description" placeholder="Detailed about your committee"></textarea>
      </div>

      <div class="form-group">
        <label>Logo URL</label>
        <input [(ngModel)]="profile.logo_url" placeholder="Link to your logo image">
      </div>

      <div class="form-group">
        <label>Contact Info</label>
        <input [(ngModel)]="profile.contact_info" placeholder="Email or Social Media link">
      </div>

      <button (click)="saveProfile()" [disabled]="loading">
        {{ loading ? 'Saving...' : 'Save Profile' }}
      </button>
    </div>
  `,
  styles: [`
    .setup-container { max-width: 600px; margin: 40px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input, textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    textarea { height: 100px; }
    button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; }
  `]
})
export class CommitteeProfileSetupComponent implements OnInit {
  profile: any = {
    name: '',
    description: '',
    long_description: '',
    logo_url: '',
    contact_info: ''
  };
  loading = false;

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.fetchProfile();
  }

  fetchProfile() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`);
    this.http.get('http://localhost:8000/api/committee/profile/me', { headers }).subscribe({
      next: (res: any) => {
        if (res) this.profile = res;
      }
    });
  }

  saveProfile() {
    this.loading = true;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`);
    this.http.post('http://localhost:8000/api/committee/profile', this.profile, { headers }).subscribe({
      next: () => {
        this.loading = false;
        alert('Profile saved!');
        this.router.navigate(['/committee/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error saving profile: ' + (err.error?.detail || 'Unknown error'));
      }
    });
  }
}
