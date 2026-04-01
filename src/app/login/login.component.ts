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

  email: string = '';
  password: string = '';
  loading: boolean = false;

  login() {

    // validation
    if(this.email === '' || this.password === ''){
      alert("Please fill all fields");
      return;
    }

    if(this.password.length < 8){
      alert("Password must be at least 8 characters");
      return;
    }

    // start loading
    this.loading = true;

    // simulate server delay
    setTimeout(() => {
      this.loading = false;
      alert("Login Successful!");

      // optional: redirect later
      // this.router.navigate(['/']);
      
    }, 1500);
  }
}