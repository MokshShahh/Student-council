import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  role = 'student';

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

    const registrationData = { 
      email: this.email, 
      password: this.password,
      full_name: this.name,
      phone: this.phone,
      role: this.role
    };

    this.authService.register(registrationData).subscribe({
      next: (res) => {
        // Auto-login after registration to redirect to profile setup if needed
        this.authService.login({ email: this.email, password: this.password }).subscribe({
          next: () => {
            this.loading = false;
            alert("Registration Successful!");
            if (this.role === 'committee') {
              this.router.navigate(['/committee/profile-setup']);
            } else {
              this.router.navigate(['/']);
            }
          },
          error: () => {
             this.loading = false;
             this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.detail || "Registration failed");
      }
    });
  }
}
