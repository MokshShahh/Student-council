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

 applications = [
  {
    name: 'Arjun Patel',
    email: 'arjun@student.com',
    committee: 'Cult Com',
    status: 'Accepted'
  },
  {
    name: 'Karan Singh',
    email: 'karan@student.com',
    committee: 'Sports Committee',
    status: 'Rejected'
  },
  {
    name: 'Riya Sharma',
    email: 'riya@student.com',
    committee: 'Tech',
    status: 'Pending'
  }
];
  

  constructor(private appService: ApplicationService) {}
currentUser: any;

ngOnInit() {
  this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
}

getCount(status: string) {
  return this.applications.filter(a => a.status === status).length;
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