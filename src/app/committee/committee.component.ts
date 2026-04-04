import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-committee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './committee.component.html',
  styleUrls: ['./committee.component.css']
})
export class CommitteeComponent {

  committees = [
    {
      name: 'Technical & Research',
      members: 32,
      gradient: 'linear-gradient(135deg,#00c6ff,#0072ff)',
      icon: 'fa-microchip',
      desc: 'We organize hackathons, coding competitions and tech fests.'
    },
    {
      name: 'Cult Com',
      members: 40,
      gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
      icon: 'fa-theater-masks',
      desc: 'We handle cultural events, festivals and performances.'
    },
    {
      name: 'Social Impact',
      members: 28,
      gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)',
      icon: 'fa-handshake',
      desc: 'We focus on social initiatives and community work.'
    },
    {
      name: 'Sports Committee',
      members: 20,
      gradient: 'linear-gradient(135deg,#f7971e,#ffd200)',
      icon: 'fa-trophy',
      desc: 'We organize sports events and competitions.'
    }
  ];

  selectedCommittee: any = null;

  openCommittee(c: any) {
    this.selectedCommittee = c;
  }

  closeCommittee() {
    this.selectedCommittee = null;
  }

  apply() {
    alert("Application submitted successfully!");
  }
}