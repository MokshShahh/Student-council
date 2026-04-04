import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  currentPage = 'dashboard';

  constructor(private router: Router) {}

  go(page: string) {
    this.currentPage = page;
  }

  goToAddEvent() {
    this.router.navigate(['/add-event']);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}