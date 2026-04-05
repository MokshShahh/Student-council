import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private key = 'applications';

  getApplications() {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  apply(application: any) {
    const apps = this.getApplications();

    apps.push({
      ...application,
      status: 'Pending'
    });

    localStorage.setItem(this.key, JSON.stringify(apps));
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}