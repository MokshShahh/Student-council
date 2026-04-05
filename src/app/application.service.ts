import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  apply(committeeId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/committees/${committeeId}/apply`, {});
  }

  getCommitteeApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/committee/applications`);
  }

  getMyApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/applications/me`);
  }

  updateStatus(appId: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/committee/applications/${appId}?new_status=${status}`, {});
  }
}
