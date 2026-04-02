import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './event-form.component.html'
})
export class EventFormComponent {

  title = '';
  description = '';
  date = '';
  venue = '';

  constructor(private eventService: EventService) {}

  submitEvent() {

    if (!this.title || !this.description) {
      alert("Fill all fields");
      return;
    }

    const event = {
      name: this.title,
      description: this.description,
      date: this.date,
      venue: this.venue,
      approved: false
    };

    this.eventService.addEvent(event).subscribe(() => {
      alert("Event submitted!");
      this.title = '';
      this.description = '';
      this.date = '';
      this.venue = '';
    });
  }
}