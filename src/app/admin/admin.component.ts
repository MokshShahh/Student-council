import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../event.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent {

  constructor(public eventService: EventService) {}

  approve(event: any) {
    this.eventService.approveEvent(event);
  }

}