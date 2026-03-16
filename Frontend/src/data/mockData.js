export const contacts = [
  {
    id: "u1",
    name: "Elizabeth Olsen",
    role: "Junior Developer",
    online: true,
    unread: 0,
  },
  {
    id: "u2",
    name: "Brad Frost",
    role: "Product Designer",
    online: false,
    unread: 1,
  },
  {
    id: "u3",
    name: "Paul Irish",
    role: "Frontend Engineer",
    online: false,
    unread: 0,
  },
  { id: "u4", name: "Lina Roy", role: "QA Engineer", online: true, unread: 2 },
  {
    id: "u5",
    name: "Jessica Giloy",
    role: "Data Analyst",
    online: false,
    unread: 0,
  },
];

export const seedMessages = [
  {
    id: 1,
    from: "them",
    text: "I looked at the project structure and found some issues.",
    time: "10:42 AM",
  },
  {
    id: 2,
    from: "me",
    text: "Can you send the report with the bug list?",
    time: "10:44 AM",
  },
  {
    id: 3,
    from: "them",
    text: "Sure. I will share the PDF and screenshots shortly.",
    time: "10:46 AM",
  },
];

export const routeInfo = {
  auth: [
    "POST /api/auth/signup",
    "POST /api/auth/login",
    "POST /api/auth/logout",
    "PUT /api/auth/update-profile",
    "GET /api/auth/check",
  ],
  messages: [
    "GET /api/messages/users",
    "GET /api/messages/:id",
    "POST /api/messages/send/:id",
  ],
};
