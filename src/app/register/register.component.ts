import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';

  errors: any = {};
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  validate() {

    this.errors = {};
    let valid = true;

    if (this.name.trim() === '') {
      this.errors.name = "Name required";
      valid = false;
    }

    if (!this.email.includes('@')) {
      this.errors.email = "Valid email required";
      valid = false;
    }

    if (!/^[0-9]{10}$/.test(this.phone)) {
      this.errors.phone = "Enter valid 10-digit phone";
      valid = false;
    }

    if (this.password.length < 8) {
      this.errors.password = "Minimum 8 characters";
      valid = false;
    }

    if (this.password !== this.confirmPassword) {
      this.errors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    return valid;
  }

  register() {
    if (!this.validate()) return;

    this.loading = true;

    this.authService.register({ 
      email: this.email, 
      password: this.password 
    }).subscribe({
      next: (res) => {
        this.loading = false;
        alert("Registration Successful!");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.detail || "Registration failed");
      }
    });
  }
}
