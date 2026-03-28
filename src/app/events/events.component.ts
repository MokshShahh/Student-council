import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './events.component.html'
})
export class EventsComponent {

  title: string = '';
  description: string = '';

  events: any[] = [
    { title: 'Dance Competition', description: 'Annual cultural fest', approved: true }
  ];

  addEvent() {

    const newEvent = {
      title: this.title,
      description: this.description,
      approved: false
    };

    this.events.push(newEvent);

    alert("Event submitted for approval!");

    this.title = '';
    this.description = '';
  }

}