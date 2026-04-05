import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  role: 'admin' | 'student' | 'committee' = 'admin';
  email = '';
  password = '';
  error = '';
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  setRole(r: 'admin' | 'student' | 'committee') {
    this.role = r;
    this.error = '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.email || !this.password) {
      this.error = 'Please enter email and password';
      return;
    }

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        if (this.auth.isAdmin()) {
          this.router.navigate(['/admin']);
        } else if (this.auth.isCommittee()) {
          const user = this.auth.currentUser();
          if (user && !user.committee_id) {
            // Redirect to profile setup if not yet completed
            this.router.navigate(['/committee/profile-setup']);
          } else {
            this.router.navigate(['/committee/dashboard']);
          }
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.error = err.error?.detail || 'Invalid credentials';
      }
    });
  }
}