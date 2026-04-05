import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EVENTS, COMMITTEES } from '../data';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  events = EVENTS;
  committees = COMMITTEES;

  currentSlide = 0;
  sidebarOpen = true;
  currentUser: any;

ngOnInit() {
  this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
}

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