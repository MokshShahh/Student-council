import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  events = [
    { title: 'Dance Competition', description: 'Cultural Fest', approved: true }
  ];

  addEvent(event: any) {
    this.events.push(event);
  }

  getEvents() {
    return this.events;
  }

  approveEvent(event: any) {
    event.approved = true;
  }

}