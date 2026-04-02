import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../event.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  events = signal<any[]>([]);

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.eventService.getEvents().subscribe({
      next: (data: any) => this.events.set(data),
      error: (err) => console.error(err)
    });
  }

  approve(event: any) {
    this.eventService.approveEvent(event.id).subscribe(() => {
      alert("Approved!");
      this.fetchEvents();
    });
  }

}