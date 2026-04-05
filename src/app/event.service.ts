import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events`);
  }

  getPendingEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/events/pending`);
  }

  approveEvent(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/events/${id}/approve`, {});
  }

  createEvent(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/events`, formData);
  }

  getCommitteeEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/committee/dashboard/events`);
  }

  registerForEvent(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/events/${id}/register`, {});
  }

  getMyEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events/me`);
  }
}
