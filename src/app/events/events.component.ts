import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EVENTS } from '../data';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html'
})
export class EventsComponent {

  events = EVENTS;
  selectedEvent: any = null;

  openEvent(event: any) {
    this.selectedEvent = event;
  }

  closeEvent() {
    this.selectedEvent = null;
  }

  register() {
    alert("Registered successfully!");
  }
}