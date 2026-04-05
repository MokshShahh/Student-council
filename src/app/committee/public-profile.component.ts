import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommitteeService } from '../committee.service';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container" *ngIf="data">
      <div class="header">
        <img [src]="data.committee.logo_url" *ngIf="data.committee.logo_url" class="logo">
        <div class="info">
          <h1>{{ data.committee.name }}</h1>
          <p class="tagline">{{ data.committee.description }}</p>
          <p class="contact" *ngIf="data.committee.contact_info">Contact: {{ data.committee.contact_info }}</p>
        </div>
      </div>

      <div class="about">
        <h3>About Us</h3>
        <p>{{ data.committee.long_description }}</p>
      </div>

      <hr>

      <h3>Events by {{ data.committee.name }}</h3>
      <div class="events-grid">
        <div class="event-card" *ngFor="let event of data.events">
          <img [src]="event.banner || 'https://via.placeholder.com/300x150'" class="banner">
          <div class="event-info">
            <h4>{{ event.name }}</h4>
            <p>{{ event.description }}</p>
            <a [href]="event.registration_link" target="_blank" class="register-btn" *ngIf="event.registration_link">Register</a>
          </div>
        </div>
      </div>
      <div *ngIf="data.events.length === 0">No upcoming events.</div>
    </div>
  `,
  styles: [`
    .profile-container { max-width: 900px; margin: 40px auto; padding: 20px; }
    .header { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
    .logo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid #007bff; }
    .tagline { font-style: italic; color: #666; }
    .about { margin-bottom: 40px; line-height: 1.6; }
    .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .event-card { border: 1px solid #eee; border-radius: 12px; overflow: hidden; transition: transform 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .event-card:hover { transform: translateY(-5px); }
    .banner { width: 100%; height: 150px; object-fit: cover; }
    .event-info { padding: 15px; }
    .register-btn { display: inline-block; padding: 8px 16px; background: #007bff; color: white; border-radius: 6px; text-decoration: none; margin-top: 10px; }
  `]
})
export class CommitteePublicProfileComponent implements OnInit {
  data: any = null;

  constructor(private committeeService: CommitteeService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.committeeService.getCommitteePublic(+id).subscribe({
        next: (res) => this.data = res
      });
    }
  }
}
