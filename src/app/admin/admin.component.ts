import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../event.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  events: any[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.eventService.getEvents().subscribe(data => {
      this.events = data;
    });
  }

  approve(event: any) {
    this.eventService.approveEvent(event.id).subscribe(() => {
      this.load();
    });
  }
}