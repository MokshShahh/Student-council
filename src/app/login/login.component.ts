import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="auth-box">
      <h2>Login</h2>
      <input placeholder="Email">
      <input placeholder="Password" type="password">
      <button>Login</button>
    </div>
  `
})
export class LoginComponent {}