import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  role: 'admin' | 'student' = 'student';

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;

  error = '';
  success = '';

  constructor(private router: Router) {}

  setRole(r: 'admin' | 'student') {
    this.role = r;
    this.error = '';
    this.success = '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
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

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    users.push({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    });

    localStorage.setItem('users', JSON.stringify(users));

    this.success = 'Registration successful! Redirecting...';
    this.error = '';

    setTimeout(() => {
  if (this.role === 'admin') {
    this.router.navigate(['/admin']);
  } else {
    this.router.navigate(['/dashboard']);
  }
}, 1000);
  }
}