import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApplicationService } from '../application.service'; // ✅ make sure path is correct

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  applications: any[] = [];
  currentUser: any;

  constructor(
    private appService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loadApplications();
  }

  loadApplications() {
    this.applications = this.appService.getApplications();
  }

  approve(i: number) {
    this.applications[i].status = 'Accepted'; // ✅ keep consistent
    this.save();
  }

  reject(i: number) {
    this.applications[i].status = 'Rejected';
    this.save();
  }

  save() {
    localStorage.setItem('applications', JSON.stringify(this.applications));
    this.loadApplications();
  }

  getCount(status: string) {
    return this.applications.filter(a => a.status === status).length;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}