import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8000/api/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any[]> {
    // Interceptor adds Authorization header automatically
    return this.http.get<any[]>(this.apiUrl);
  }

  addEvent(event: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, event);
  }

  approveEvent(eventId: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${eventId}/approve`, {});
  }
}
