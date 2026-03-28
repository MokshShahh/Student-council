import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  login() {
    if(this.email === '' || this.password === ''){
      alert("Please fill all fields");
      return;
    }

    if(this.password.length < 8){
      alert("Password must be at least 8 characters");
      return;
    }

    alert("Login Successful!");
  }

}