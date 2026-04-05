import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventService } from '../event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './event-form.component.html'
})
export class EventFormComponent {

  title = '';
  description = '';

  constructor(private eventService: EventService, private router: Router) {}

  submit() {
    if (!this.title || !this.description) return;

    this.eventService.addEvent({
      name: this.title,
      description: this.description
    }).subscribe(() => {
      alert("Event Added!");
      this.router.navigate(['/events']);
    });
  }
}