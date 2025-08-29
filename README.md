# 🐾 Kopi & Paws

---

![Kopi & Paws](/assets//kopi&paws.png)

---

## Table of Contents

- [About Kopi & Paws](/Users/austinchen/.Trash/kopi&paws.png)
- [Features](/Users/austinchen/.Trash/kopi&paws.png)
- [Tech Stack](/Users/austinchen/.Trash/kopi&paws.png)
- [App Hierarchy]()
- [File Structure]()
- [API References]()
- [Setup & Installation]()

---

## About Kopi & Paws

Kopi & Paws is a React app for planning paw-some meetups at curated, pet-friendly locations. Browse venues with photos and capacity, spin up an event with a title, description, and date/time, then invite the crew to join. Guests can RSVP with or without their pets, and you’ll see humans and fur friends show up live in the attendee list.

Hosting is simple: add details, cancel or complete events when plans change, and delete ones you don’t need. Hosts manage their own events, while admins can manage everything. Your events, locations, users, and pets are stored with MongoDB and served via an Express API so you can come back anytime to pick up where you left off.

![App platform overview](/assets/platformOverview.png)

## ✨ Features

- Browse curated, pet-friendly locations with photos and capacity
- Host events with title, description, start/end date & time
- RSVP as a user and choose none/some/all of your pets to join
- See live attendees: humans and pet names shown separately
- Edit or delete events (host-only); admins can manage all events
- Update event status: scheduled / cancelled / completed
- View event details on the card (host, time, description)
- Manage your pets: add, edit, and remove from your profile
- Role-based access via JWT (host/admin) for protected actions
- Data persisted with MongoDB, served by an Express API
- Clean modal forms for Create & Edit to keep flows simple
- Admins can grant admin rights to other users (starting from the seeded admin)

### Roles permission

| Capability                                                           | Guest | User | Admin |
| -------------------------------------------------------------------- | :---: | :--: | :---: |
| Browse pet-friendly locations                                        |  ✅   |  ✅  |  ✅   |
| View events at a location                                            |  ✅   |  ✅  |  ✅   |
| View event details (host, time, description, status)                 |  ✅   |  ✅  |  ✅   |
| See attendee list (humans & pets)                                    |  ✅   |  ✅  |  ✅   |
| Create/host events                                                   |   -   |  ✅  |  ✅   |
| Edit/Delete **own** events                                           |   -   |  ✅  |  ✅   |
| Edit/Delete **any** event                                            |   -   |  -   |  ✅   |
| Update status (scheduled / cancelled / completed) for **own** events |   -   |  ✅  |  ✅   |
| Update status for **any** event                                      |   -   |  -   |  ✅   |
| Join/leave events                                                    |   -   |  ✅  |  ✅   |
| Select none/some pets when joining                                   |   -   |  ✅  |  ✅   |
| Manage own pets (add / edit / delete)                                |   -   |  ✅  |  ✅   |
| Manage locations (add / update / delete)                             |   -   |  -   |  ✅   |
| Mangae profile (age, introduction)                                   |   -   |  ✅  |  ✅   |

> Pro tip: Increase engagement then request for admin promotion
>
> > Ask any admin for promotion

### Updating status

Keep everyone in the loop by updating the event’s status.  
You can mark an event as **Scheduled**, **Cancelled**, or **Completed** so participants always know what’s happening.

- **Scheduled** – the default state when an event is created
- **Cancelled** – let participants know the event won’t take place
- **Completed** – mark the event as finished

| Scheduled                                 | Cancelled                                 | Completed                                 |
| ----------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| ![Scheduled](/assets/scheduledStatus.png) | ![Cancelled](/assets/cancelledStatus.png) | ![Completed](/assets/completedStatus.png) |

### How to join an Event

1. **Select a Location**  
   Browse through the available locations and pick the event you’d like to join.  
   _Tip: Double-check that you’re joining the correct event!_

![Location page with events to join](/assets/joiningEvent.png)

2. **Choose Your Pet(s)**  
   a. Bring one, multiple, or all of your pets.  
   b. Or simply join the event on your own — totally up to you!

![Updated attendees panel after joining](/assets/attendeesPanel.png)

## 🛠 Tech Stack

| Technology   | Purpose                                                        |
| ------------ | -------------------------------------------------------------- |
| React (Vite) | Render UI and component structure                              |
| CSS          | Styling and layout                                             |
| Express      | Backend server and API routing                                 |
| MongoDB      | Database to store users, profiles, pets, locations, and events |

## 🪾 App Hierarchy & ERD

**App Hierarchy**
![app hierarchy](/assets/appHierarchy.png)
**Entity Relationship Diagram**
![entity relationship diagram](/assets/ERD.png)

## 📂 File Structure

**frontend**

- src/
  - assets/ : for images used
  - components/ : page-specific or global features
  - context/ : for useContext
  - hooks/ : custom hooks
  - Modals/ : modals that appear in multiple pages
  - Pages/ : page-level components
  - Routes/ : rerouters
  - styles/ : styling and layout

**backend**

- src/
  - controllers/ : handle incoming requests
  - db/ : connection with the database
  - middleware/ : reusable logic for request/response processing
  - models/ : define data schemas and interact with database
  - routers/ : routing of endpoints to controllers
  - scripts/ : for utilities
  - validators/ : input validation for requests

## 🚀 Setup & Installation

1. Clone this repo
2. On the backend/ directory, change the .env.example file to .env with the following:

   1. `PORT=<your port number>`
   2. `DATABASE=<your database>`
   3. `ACCESS_SECRET=<your JWT secret for your access token>`
   4. `REFRESH_SECRET=<your JWT secret for your refresh token>`

3. On the frontend/ directory, change the .env.example file to .env with the following:

   1. `VITE_SERVER=<your Vite proxy server>`

4. Install dependencies and run both servers
   **In the backend/ directory**
   1. `cd backend`
   2. `npm install`
   3. `npm run dev`
      **In the frontend/ directory**
   4. `cd frontend`
   5. `npm install`
   6. `npm run dev`
