import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="auth-box">
      <h2>Register</h2>
      <input placeholder="Name">
      <input placeholder="Email">
      <input placeholder="Password">
      <button>Register</button>
    </div>
  `
})
export class RegisterComponent {}