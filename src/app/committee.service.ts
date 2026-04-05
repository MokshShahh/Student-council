import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommitteeService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getCommittees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/committees`);
  }

  getCommitteePublic(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/committees/${id}/public`);
  }

  getMyProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/committee/profile/me`);
  }

  saveProfile(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/committee/profile`, formData);
  }
}
