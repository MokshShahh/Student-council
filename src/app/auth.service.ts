import { Injectable, signal, effect } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  currentUser = signal<any>(null);
  userRole = signal<string | null>(null);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.decodeAndSetUser(token);
    }
  }

  private decodeAndSetUser(token: string) {
    try {
      const decoded: any = jwtDecode(token);
      console.log('Decoded Token:', decoded);
      this.currentUser.set({ email: decoded.email, token, committee_id: decoded.committee_id });
      this.userRole.set(decoded.role);
      console.log('User Role Set To:', this.userRole());
    } catch (e) {
      console.error('Error decoding token:', e);
      this.logout();
    }
  }

  login(credentials: any): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', credentials.email);
    body.set('password', credentials.password);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post<any>(`${this.apiUrl}/token`, body.toString(), { headers }).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
        this.decodeAndSetUser(res.access_token);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.userRole.set(null);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const role = this.userRole()?.toLowerCase();
    return role === 'admin';
  }

  isCommittee(): boolean {
    const role = this.userRole()?.toLowerCase();
    return role === 'committee';
  }
}
