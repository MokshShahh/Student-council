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

  console.log("Adding event..."); // DEBUG

  this.eventService.addEvent({
    title: this.title,
    description: this.description,
    approved: false
  });

  console.log(this.eventService.getEvents()); // DEBUG

  alert("Event added!");

  this.title = '';
  this.description = '';
}

}