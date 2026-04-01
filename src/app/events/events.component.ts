import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventService } from '../event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './events.component.html'
})
export class EventsComponent {

  title = '';
  description = '';

  constructor(public eventService: EventService) {}

  addEvent() {
    this.eventService.addEvent({
      title: this.title,
      description: this.description,
      approved: false
    });

    alert("Event sent to admin for approval");

    this.title = '';
    this.description = '';
  }

}