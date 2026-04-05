import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  applications: any[] = [];

  constructor(private appService: ApplicationService) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.applications = this.appService.getApplications();
  }

  approve(i: number) {
    this.applications[i].status = 'Approved';
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
}