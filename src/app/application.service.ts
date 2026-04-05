import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private key = 'applications';

  // ✅ GET ALL APPLICATIONS
  getApplications() {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  // ✅ APPLY (STUDENT SIDE)
  apply(application: any) {
    const apps = this.getApplications();

    apps.push({
      id: Date.now(), // ✅ unique id
      name: application.name,
      email: application.email,
      committee: application.committee,
      status: 'Pending'
    });

    localStorage.setItem(this.key, JSON.stringify(apps));
  }

  // ✅ UPDATE STATUS (ADMIN SIDE)
  updateStatus(index: number, status: string) {
    const apps = this.getApplications();

    if (apps[index]) {
      apps[index].status = status;
    }

    localStorage.setItem(this.key, JSON.stringify(apps));
  }

  // ✅ DELETE APPLICATION (OPTIONAL FEATURE)
  delete(index: number) {
    const apps = this.getApplications();
    apps.splice(index, 1);
    localStorage.setItem(this.key, JSON.stringify(apps));
  }

  // ✅ CLEAR ALL (RESET)
  clear() {
    localStorage.removeItem(this.key);
  }
}