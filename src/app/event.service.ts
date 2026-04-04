import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {

  private baseUrl = 'http://localhost:8000/api/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  addEvent(event: any): Observable<any> {
    return this.http.post(this.baseUrl, event);
  }

  approveEvent(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/approve`, {});
  }
}