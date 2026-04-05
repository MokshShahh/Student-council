import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../event.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  pendingEvents: any[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadPendingEvents();
  }

  loadPendingEvents() {
    this.eventService.getPendingEvents().subscribe({
      next: (events) => this.pendingEvents = events,
      error: (err) => console.error('Error loading pending events:', err)
    });
  }

  approveEvent(id: number) {
    this.eventService.approveEvent(id).subscribe({
      next: () => {
        alert('Event approved!');
        this.loadPendingEvents();
      },
      error: (err) => alert('Error approving event: ' + (err.error?.detail || 'Unknown error'))
    });
  }
}
