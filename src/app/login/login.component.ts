import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommitteeService } from '../committee.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private committeeService = inject(CommitteeService);

  role: 'admin' | 'student' | 'committee' = 'admin';
  email = '';
  password = '';
  error = '';
  showPassword = false;

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
      next: (res) => {
        const decoded: any = jwtDecode(res.access_token);
        const userRole = decoded.role?.toLowerCase();

        if (userRole === 'admin') {
          this.router.navigate(['/admin']);
        } else if (userRole === 'committee') {
          this.committeeService.getMyProfile().subscribe({
            next: (profile) => {
              if (!profile || !profile.description) {
                this.router.navigate(['/committee/profile-setup']);
              } else {
                this.router.navigate(['/committee/dashboard']);
              }
            },
            error: () => {
              this.router.navigate(['/committee/profile-setup']);
            }
          });
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