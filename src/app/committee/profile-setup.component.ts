import { Component, OnInit } from '@angular/core';
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
        <label>Committee Logo</label>
        <input type="file" (change)="onFileSelected($event)" accept="image/*">
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
    contact_info: ''
  };
  selectedFile: File | null = null;
  loading = false;

  constructor(private committeeService: CommitteeService, private auth: AuthService, private router: Router) {}

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
    if (this.selectedFile) {
      formData.append('logo', this.selectedFile);
    }

    this.committeeService.saveProfile(formData).subscribe({
      next: () => {
        this.loading = false;
        alert('Profile saved!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        alert('Error saving profile: ' + (err.error?.detail || 'Unknown error'));
      }
    });
  }
}
