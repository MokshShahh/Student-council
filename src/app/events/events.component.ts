import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventService } from '../event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './events.component.html'
})
export class EventsComponent implements OnInit {

  title = '';
  description = '';
  events = signal<any[]>([]);

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.eventService.getEvents().subscribe({
      next: (data) => this.events.set(data),
      error: (err) => console.error('Error fetching events:', err)
    });
  }

  addEvent() {
    if (!this.title || !this.description) return;

    const newEvent = {
      name: this.title, // Backend uses 'name'
      description: this.description,
      committee_id: 1 // Placeholder for now
    };

    this.eventService.addEvent(newEvent).subscribe({
      next: (res) => {
        alert("Event added!");
        this.fetchEvents(); // Refresh list
        this.title = '';
        this.description = '';
      },
      error: (err) => {
        alert("Error adding event. Make sure you are logged in!");
      }
    });
  }
}
