import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../event.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  events = signal<any[]>([]);
  errorMessage = signal<string | null>(null);
  
  // Computed property to filter pending events
  pendingEvents = computed(() => 
    this.events().filter(event => !event.is_approved)
  );

  // Computed property to filter approved events
  approvedEvents = computed(() => 
    this.events().filter(event => event.is_approved)
  );

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents() {
    this.eventService.getAdminEvents().subscribe({
      next: (data) => {
        console.log('Admin Dashboard: Fetched Events:', data);
        this.events.set(data);
        this.errorMessage.set(null);
      },
      error: (err) => {
        console.error('Admin Dashboard: Error fetching events:', err);
        this.errorMessage.set(`Failed to load events: ${err.message}`);
      }
    });
  }

  approve(event: any) {
    if (!event.id) return;
    this.eventService.approveEvent(event.id).subscribe({
      next: () => {
        alert('Event approved!');
        this.fetchEvents();
      },
      error: (err) => {
        alert('Error approving event. Are you an admin?');
        console.error(err);
      }
    });
  }
}
