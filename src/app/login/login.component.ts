import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  loading = false;

  validate() {
    let valid = true;

    this.emailError = '';
    this.passwordError = '';

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

    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      alert("Login Successful!");
    }, 1500);
  }
}