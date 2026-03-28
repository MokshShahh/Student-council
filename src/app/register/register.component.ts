import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  name:string='';
  email:string='';
  phone:string='';
  password:string='';
  confirmPassword:string='';

  register(){
    if(!this.name || !this.email || !this.phone || !this.password){
      alert("All fields required");
      return;
    }

    if(this.password !== this.confirmPassword){
      alert("Passwords do not match");
      return;
    }

    alert("Registration Successful!");
  }

}