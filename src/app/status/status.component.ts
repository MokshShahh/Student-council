import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status.component.html'
})
export class StatusComponent implements OnInit {

  applications: any[] = [];

  constructor(private appService: ApplicationService) {}

  ngOnInit() {
    this.loadStatus();
  }

  loadStatus() {
    this.appService.getMyApplications().subscribe({
      next: (apps: any[]) => {
        this.applications = apps;
      },
      error: (err: any) => console.error('Error loading applications:', err)
    });
  }
}
