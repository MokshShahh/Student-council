import { Component, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { CommitteeService } from '../committee.service';
import { SafePipe } from '../safe.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, SafePipe],
  templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit, OnInit {
  private committeeService = inject(CommitteeService);
  committees: any[] = [];

  ngOnInit() {
    this.committeeService.getCommittees().subscribe({
      next: (res) => this.committees = res,
      error: (err) => console.error('Error loading committees:', err)
    });
  }

  ngAfterViewInit() {
    const cards = document.querySelectorAll('.card');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });

    cards.forEach(card => observer.observe(card));
  }

}
