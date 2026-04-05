import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../application.service';
import { CommitteeService } from '../committee.service';
import { SafePipe } from '../safe.pipe';

@Component({
  selector: 'app-committee',
  standalone: true,
  imports: [CommonModule, SafePipe],
  templateUrl: './committee.component.html',
  styleUrls: ['./committee.component.css']
})
export class CommitteeComponent implements OnInit {

  committees: any[] = [];
  selectedCommittee: any = null;

  constructor(
    private appService: ApplicationService,
    private committeeService: CommitteeService
  ) {}

  ngOnInit() {
    this.loadCommittees();
  }

  loadCommittees() {
    this.committeeService.getCommittees().subscribe({
      next: (committees) => {
        // Add default icons/gradients if not present in backend
        this.committees = committees.map((c: any) => ({
          ...c,
          icon: c.icon || 'fa-users',
          gradient: c.gradient || 'linear-gradient(135deg,#667eea,#764ba2)',
          members: c.members || 0
        }));
      },
      error: (err) => {
        console.error('Error fetching committees:', err);
      }
    });
  }

  openCommittee(c: any) {
    this.selectedCommittee = c;
  }

  closeCommittee() {
    this.selectedCommittee = null;
  }

  apply() {
    if (!this.selectedCommittee) return;

    this.appService.apply(this.selectedCommittee.id).subscribe({
      next: () => {
        alert("Application Submitted!");
        this.closeCommittee();
      },
      error: (err) => {
        alert("Error: " + (err.error?.detail || "Could not apply"));
      }
    });
  }}