import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {

  newsList = [
    {
      title: 'Tech Fest 2025 Winners Announced!',
      desc: 'Team InnovatorsX won the flagship hackathon.',
      date: 'Feb 20, 2026',
      category: 'Announcement'
    },
    {
      title: 'Committee Recruitment Open',
      desc: 'Apply before March 31st for all committees.',
      date: 'Feb 15, 2026',
      category: 'Announcement'
    },
    {
      title: 'Cultural Fest Registration Live',
      desc: 'Register before April 15th.',
      date: 'Feb 10, 2026',
      category: 'Event'
    },
    {
      title: 'Hackathon Problem Statements Released',
      desc: 'Themes: AI, FinTech, Smart Cities.',
      date: 'Jan 28, 2026',
      category: 'Event'
    }
  ];
}