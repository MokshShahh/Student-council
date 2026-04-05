import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  applications: any[] = [];

  constructor(private appService: ApplicationService) {}

  ngOnInit() {
    this.applications = this.appService.getApplications();
  }
}