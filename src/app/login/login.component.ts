import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  role: 'admin' | 'student' = 'admin';

  email = '';
  password = '';
  showPassword = false;
  error = '';

  constructor(private router: Router) {}

  setRole(r: 'admin' | 'student') {
    this.role = r;
    this.error = '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {

    const users = [
      { email: 'admin@council.com', password: 'admin123', role: 'admin' },
      { email: 'student@council.com', password: 'student123', role: 'student' }
    ];

    const user = users.find(
      u => u.email === this.email && u.password === this.password
    );

    if (!user) {
      this.error = 'Invalid credentials';
      return;
    }

    if (user.role !== this.role) {
      this.error = `Login as ${this.role}`;
      return;
    }

    // Save user
    sessionStorage.setItem('user', JSON.stringify(user));

    // Redirect
    if (user.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}