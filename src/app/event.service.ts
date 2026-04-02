import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EventService {

  constructor(private http: HttpClient) {}

  getEvents() {
    return this.http.get('http://localhost:5000/events');
  }

  addEvent(event: any) {
    return this.http.post('http://localhost:5000/events', event);
  }

  approveEvent(id: number) {
    return this.http.put(`http://localhost:5000/events/${id}/approve`, {});
  }
}