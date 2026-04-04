import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-committee-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="dashboard-container">
      <h2>Committee Dashboard</h2>
      
      <div class="stats" *ngIf="profile">
        <h3>Welcome, {{ profile.name }}</h3>
        <p>{{ profile.description }}</p>
      </div>

      <hr>

      <div class="event-creation">
        <h3>Create New Event</h3>
        <div class="form-group">
          <input [(ngModel)]="newEvent.name" placeholder="Event Name">
          <textarea [(ngModel)]="newEvent.description" placeholder="Event Description"></textarea>
          <input [(ngModel)]="newEvent.registration_link" placeholder="Registration Link">
          <input [(ngModel)]="newEvent.banner" placeholder="Banner Image URL">
          <div class="date-group">
             <label>Start Time</label>
             <input type="datetime-local" [(ngModel)]="newEvent.start_time">
          </div>
          <div class="date-group">
             <label>End Time</label>
             <input type="datetime-local" [(ngModel)]="newEvent.end_time">
          </div>
          <button (click)="createEvent()" [disabled]="creating">
            {{ creating ? 'Creating...' : 'Create Event' }}
          </button>
        </div>
      </div>

      <hr>

      <div class="events-list">
        <h3>Your Events</h3>
        <div *ngIf="events.length === 0">No events found.</div>
        <div class="event-card" *ngFor="let event of events">
          <h4>{{ event.name }}</h4>
          <p>{{ event.description }}</p>
          <span class="status" [class.approved]="event.is_approved">
            {{ event.is_approved ? 'Approved' : 'Pending Approval' }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { max-width: 800px; margin: 20px auto; padding: 20px; }
    .event-card { border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px; }
    .status { font-size: 0.8em; padding: 2px 6px; border-radius: 4px; background: #eee; }
    .status.approved { background: #d4edda; color: #155724; }
    .form-group input, .form-group textarea { width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; }
    .date-group { margin-bottom: 10px; }
    button { padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
  `]
})
export class CommitteeDashboardComponent implements OnInit {
  profile: any = null;
  events: any[] = [];
  newEvent: any = {
    name: '',
    description: '',
    registration_link: '',
    banner: '',
    start_time: '',
    end_time: ''
  };
  creating = false;

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.fetchProfile();
    this.fetchEvents();
  }

  fetchProfile() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`);
    this.http.get('http://localhost:8000/api/committee/profile/me', { headers }).subscribe({
      next: (res) => this.profile = res
    });
  }

  fetchEvents() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`);
    this.http.get<any[]>('http://localhost:8000/api/committee/dashboard/events', { headers }).subscribe({
      next: (res) => this.events = res
    });
  }

  createEvent() {
    this.creating = true;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`);
    
    // Format dates for backend if needed, but ISO string usually works
    const payload = { ...this.newEvent };
    if (!payload.start_time) delete payload.start_time;
    if (!payload.end_time) delete payload.end_time;

    this.http.post('http://localhost:8000/api/events', payload, { headers }).subscribe({
      next: () => {
        this.creating = false;
        alert('Event created! Pending admin approval.');
        this.newEvent = { name: '', description: '', registration_link: '', banner: '', start_time: '', end_time: '' };
        this.fetchEvents();
      },
      error: (err) => {
        this.creating = false;
        alert('Error creating event: ' + (err.error?.detail || 'Unknown error'));
      }
    });
  }
}
