import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  events = [
    { title: 'Dance Competition', description: 'Cultural Fest', approved: true },
    { title: 'Hackathon', description: '24-hour coding event', approved: true }
  ];

}