import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../event.service';
import { CommitteeService } from '../committee.service';
import { AuthService } from '../auth.service';
import { SafePipe } from '../safe.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SafePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  myEvents: any[] = [];
  committees: any[] = [];
  currentUser: any;

  constructor(
    private eventService: EventService,
    private committeeService: CommitteeService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.currentUser();
    this.loadMyEvents();
    this.loadCommittees();
  }

  loadMyEvents() {
    this.eventService.getMyEvents().subscribe({
      next: (events) => this.myEvents = events,
      error: (err) => console.error('Error loading my events:', err)
    });
  }

  loadCommittees() {
    this.committeeService.getCommittees().subscribe({
      next: (committees) => this.committees = committees,
      error: (err) => console.error('Error loading committees:', err)
    });
  }
}
