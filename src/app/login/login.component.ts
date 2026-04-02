import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html'
  
})
export class LoginComponent {

  email = '';
  password = '';

  emailError = '';
  passwordError = '';
  loginError = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  validate() {
    let valid = true;

    this.emailError = '';
    this.passwordError = '';
    this.loginError = '';

    // Email validation
    if (this.email === '') {
      this.emailError = 'Email is required';
      valid = false;
    } else if (!this.email.includes('@')) {
      this.emailError = 'Enter a valid email';
      valid = false;
    }

    // Password validation
    if (this.password === '') {
      this.passwordError = 'Password is required';
      valid = false;
    } else if (this.password.length < 8) {
      this.passwordError = 'Minimum 8 characters required';
      valid = false;
    }

    return valid;
  }

  login() {
    if (!this.validate()) return;

  if (!this.validate()) return;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        alert("Login Successful!");
        this.router.navigate(['/']); // Navigate to home after login
      },
      error: (err) => {
        this.loading = false;
        this.loginError = 'Invalid email or password';
      }
    });
  }
}
