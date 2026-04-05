import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../event.service';
import { NewsService } from '../news.service';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { SafePipe } from '../safe.pipe';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-committee-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SafePipe, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class CommitteeDashboardComponent implements OnInit {
  private eventService = inject(EventService);
  private newsService = inject(NewsService);
  private appService = inject(ApplicationService);
  private auth = inject(AuthService);
  private router = inject(Router);

  events: any[] = [];
  news: any[] = [];
  applications: any[] = [];
  newNews = { title: '', content: '' };
  showNewsForm = false;

  ngOnInit() {
    this.loadEvents();
    this.loadNews();
    this.loadApplications();
  }

  loadEvents() {
    this.eventService.getCommitteeEvents().subscribe({
      next: (events) => this.events = events,
      error: (err) => console.error('Error loading events:', err)
    });
  }

  loadNews() {
    this.newsService.getCommitteeNews().subscribe({
      next: (news) => this.news = news,
      error: (err) => console.error('Error loading news:', err)
    });
  }

  loadApplications() {
    this.appService.getCommitteeApplications().subscribe({
      next: (apps) => this.applications = apps,
      error: (err) => console.error('Error loading applications:', err)
    });
  }

  updateAppStatus(id: number, status: string) {
    this.appService.updateStatus(id, status).subscribe({
      next: () => {
        alert(`Application ${status}`);
        this.loadApplications();
      },
      error: (err) => alert('Error: ' + (err.error?.detail || 'Could not update status'))
    });
  }

  toggleNewsForm() {
    this.showNewsForm = !this.showNewsForm;
  }

  addNews() {
    if (!this.newNews.title || !this.newNews.content) return;
    this.newsService.createNews(this.newNews).subscribe({
      next: () => {
        alert('News added!');
        this.newNews = { title: '', content: '' };
        this.showNewsForm = false;
        this.loadNews();
      },
      error: (err) => alert('Error adding news: ' + (err.error?.detail || 'Unknown error'))
    });
  }

  deleteNews(id: number) {
    if (confirm('Are you sure you want to delete this news?')) {
      this.newsService.deleteNews(id).subscribe({
        next: () => {
          alert('News deleted!');
          this.loadNews();
        },
        error: (err) => alert('Error deleting news: ' + (err.error?.detail || 'Unknown error'))
      });
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
