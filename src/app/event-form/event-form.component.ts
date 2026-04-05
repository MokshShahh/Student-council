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
  registrationLink = '';
  startTime = '';
  endTime = '';
  selectedFile: File | null = null;

  constructor(private eventService: EventService, private router: Router) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submit() {
    if (!this.title || !this.description) return;

    const formData = new FormData();
    formData.append('name', this.title);
    formData.append('description', this.description);
    if (this.registrationLink) formData.append('registration_link', this.registrationLink);
    if (this.startTime) formData.append('start_time', this.startTime);
    if (this.endTime) formData.append('end_time', this.endTime);
    if (this.selectedFile) formData.append('banner', this.selectedFile);

    this.eventService.createEvent(formData).subscribe({
      next: () => {
        alert("Event Added!");
        this.router.navigate(['/events']);
      },
      error: (err: any) => {
        alert("Error adding event: " + (err.error?.detail || "Unknown error"));
      }
    });
  }
}