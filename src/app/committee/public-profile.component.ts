import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommitteeService } from '../committee.service';
import { SafePipe } from '../safe.pipe';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule, SafePipe, RouterModule],
  templateUrl: './public-profile.component.html'
})
export class PublicProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private committeeService = inject(CommitteeService);
  private appService = inject(ApplicationService);

  committee: any = null;
  events: any[] = [];
  news: any[] = [];
  loading = true;

  ngOnInit() {
    const idStr = this.route.snapshot.paramMap.get('id');
    if (idStr && idStr !== 'NaN') {
      const id = +idStr;
      if (!isNaN(id)) {
        this.loadData(id);
      } else {
        this.loading = false;
      }
    } else {
      this.loading = false;
    }
  }

  loadData(id: number) {
    this.committeeService.getCommitteePublic(id).subscribe({
      next: (res) => {
        this.committee = res.committee;
        this.events = res.events;
        this.news = res.news;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading committee:', err);
        this.loading = false;
      }
    });
  }

  apply() {
    if (!this.committee) return;
    this.appService.apply(this.committee.id).subscribe({
      next: () => alert('Application submitted!'),
      error: (err) => alert('Error: ' + (err.error?.detail || 'Could not apply'))
    });
  }
}
