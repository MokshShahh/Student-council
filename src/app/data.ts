export const USERS = [
  { id: 1, name: 'Admin User', email: 'admin@council.com', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Riya Sharma', email: 'student@council.com', password: 'student123', role: 'student' }
];

export const COMMITTEES = [
  { id:'tech', name:'Technical & Research', icon:'fa-microchip', gradient:'linear-gradient(135deg,#0891b2,#0e7490)', members:32, events:12 },
  { id:'cult', name:'Cult Com', icon:'fa-theater-masks', gradient:'linear-gradient(135deg,#7c3aed,#6d28d9)', members:40, events:15 }
];

export const EVENTS = [
  {
    id:1,
    name:'Tech Fest 2026',
    shortDesc:'The biggest annual technology celebration',
    icon:'fa-laptop-code',
    gradient:'linear-gradient(135deg,#0ea5e9,#2563eb,#4f46e5)',
    committee:'Technical & Research'
  }
];