import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EVENTS, COMMITTEES } from '../data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  events = EVENTS;
  committees = COMMITTEES;

  currentSlide = 0;
  sidebarOpen = true;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.events.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.events.length) % this.events.length;
  }
}