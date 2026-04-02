import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
<<<<<<< Updated upstream
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
=======
import { HttpClient } from '@angular/common/http';

>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
  login() {
    if (!this.validate()) return;
=======
  constructor(private http: HttpClient) {}

login() {
>>>>>>> Stashed changes

  if (!this.validate()) return;

<<<<<<< Updated upstream
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
=======
  this.loading = true;

  this.http.post('http://localhost:5000/login', {
    email: this.email,
    password: this.password
  }).subscribe((res: any) => {

    this.loading = false;

    // store token
    localStorage.setItem('token', res.token);

    alert("Login Successful!");

  }, err => {
    this.loading = false;
    alert("Invalid credentials");
  });

}
}
>>>>>>> Stashed changes
