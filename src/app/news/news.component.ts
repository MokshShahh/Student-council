import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  private newsService = inject(NewsService);
  newsList: any[] = [];

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.newsService.getAllNews().subscribe({
      next: (news) => this.newsList = news,
      error: (err) => console.error('Error loading news:', err)
    });
  }
}
