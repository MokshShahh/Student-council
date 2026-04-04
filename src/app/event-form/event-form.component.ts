import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './event-form.component.html'
})
export class EventFormComponent {

  title = '';
  description = '';

  constructor(private eventService: EventService, private router: Router) {}

  submit() {
    if (!this.title || !this.description) {
      alert("Fill all fields");
      return;
    }

    this.eventService.addEvent({
      name: this.title,
      description: this.description
    }).subscribe(() => {
      alert("Event added!");
      this.router.navigate(['/events']);
    });
  }
}