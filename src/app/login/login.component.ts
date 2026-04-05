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
  error = '';
  showPassword = false;

  constructor(private router: Router) {}

  setRole(r: 'admin' | 'student') {
    this.role = r;
    this.error = '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find((u: any) =>
      u.email === this.email &&
      u.password === this.password &&
      u.role === this.role
    );

    if (!user) {
      this.error = 'Invalid credentials';
      return;
    }

    // ✅ SAVE LOGGED USER
    localStorage.setItem('currentUser', JSON.stringify(user));

    // ✅ REDIRECT BASED ON ROLE
    if (user.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}