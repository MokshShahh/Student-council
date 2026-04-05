import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAllNews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/news`);
  }

  getCommitteeNews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/committee/news`);
  }

  createNews(newsData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/news`, newsData);
  }

  deleteNews(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/news/${id}`);
  }
}
