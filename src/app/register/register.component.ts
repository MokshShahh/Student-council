import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  role: 'student' | 'committee' = 'student';

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;

  committeeName = '';
  selectedLogo: File | null = null;

  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  setRole(r: 'student' | 'committee') {
    this.role = r;
    this.error = '';
    this.success = '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogoSelected(event: any) {
    this.selectedLogo = event.target.files[0];
  }

  register() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.role === 'committee' && !this.committeeName) {
      this.error = 'Committee name is required';
      return;
    }

    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('full_name', this.name);
    formData.append('role', this.role);
    
    if (this.role === 'committee') {
      formData.append('committee_name', this.committeeName);
      if (this.selectedLogo) {
        formData.append('logo', this.selectedLogo);
      }
    }

    this.auth.register(formData).subscribe({
      next: (res) => {
        this.success = 'Registration successful! Redirecting to login...';
        this.error = '';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err: any) => {
        this.error = err.error?.detail || 'Registration failed';
      }
    });
  }
}