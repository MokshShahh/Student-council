import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {

  private events = [
    {
      id: 1,
      name: "Hackathon 2026",
      description: "24-hour coding competition",
      is_approved: true,
      banner: "https://via.placeholder.com/400x200",
      start_time: new Date()
    },
    {
      id: 2,
      name: "Cultural Fest",
      description: "Dance, music, and fun",
      is_approved: false,
      banner: "https://via.placeholder.com/400x200",
      start_time: new Date()
    }
  ];

  getEvents(): Observable<any[]> {
    return of(this.events);
  }

  addEvent(event: any): Observable<any> {
    event.id = Date.now();
    event.is_approved = false;
    this.events.push(event);
    return of(event);
  }

  approveEvent(id: number): Observable<any> {
    const event = this.events.find(e => e.id === id);
    if (event) event.is_approved = true;
    return of(event);
  }
}