  import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { ApplicationService } from '../application.service';
  import { COMMITTEES } from '../data';

  @Component({
    selector: 'app-committee',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './committee.component.html',
    styleUrls: ['./committee.component.css']
  })
  export class CommitteeComponent {
    

    constructor(private appService: ApplicationService) {}

    
    committees = [
      {
        name: 'Technical & Research',
        members: 32,
        gradient: 'linear-gradient(135deg,#00c6ff,#0072ff)',
        icon: 'fa-microchip',
        desc: 'We organize hackathons and coding competitions.'
      },
      {
        name: 'Cult Com',
        members: 40,
        gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
        icon: 'fa-theater-masks',
        desc: 'We manage cultural events and festivals.'
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
      this.appService.apply({
        name: "Riya Sharma",   // later dynamic
        email: "student@college.com",
        committee: this.selectedCommittee.name
      });

      alert("Application Submitted!");
      this.closeCommittee();
    }
    
  }