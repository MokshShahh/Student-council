import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../event.service';
import { NewsService } from '../news.service';
import { SafePipe } from '../safe.pipe';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, SafePipe],
  templateUrl: './events.component.html'
})
export class EventsComponent implements OnInit {
  private eventService = inject(EventService);
  private newsService = inject(NewsService);

  events: any[] = [];
  newsList: any[] = [];
  selectedEvent: any = null;

  ngOnInit() {
    this.loadEvents();
    this.loadNews();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  loadNews() {
    this.newsService.getAllNews().subscribe({
      next: (news) => {
        this.newsList = news;
      },
      error: (err) => {
        console.error('Error fetching news:', err);
      }
    });
  }

  openEvent(event: any) {
    this.selectedEvent = event;
  }

  closeEvent() {
    this.selectedEvent = null;
  }

  register(id: number) {
    this.eventService.registerForEvent(id).subscribe({
      next: (res) => {
        alert(res.message);
      },
      error: (err) => {
        alert('Error registering: ' + (err.error?.detail || 'Unknown error'));
      }
    });
  }
}