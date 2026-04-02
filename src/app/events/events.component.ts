import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventService } from '../event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './events.component.html' // ✅ CORRECT
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
      next: (data: any) => this.events.set(data),
      error: (err) => console.error(err)
    });
  }

  addEvent() {

    if (!this.title || !this.description) {
      alert("Fill all fields");
      return;
    }

    const newEvent = {
      name: this.title,
      description: this.description,
      committee_id: 1
    };

    this.eventService.addEvent(newEvent).subscribe({
      next: () => {
        alert("Event added!");
        this.fetchEvents();
        this.title = '';
        this.description = '';
      },
      error: () => {
        alert("Error adding event");
      }
    });
  }
}