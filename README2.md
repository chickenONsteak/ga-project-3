# 🐾 Kopi & Paws

---

![Kopi & Paws](/frontend//src/assets/kopi&paws.png)

---

## Table of Contents

- [About Kopi & Paws]()
- [Features]()
- [Tech Stack]()
- [App Hierarchy]()
- [File Structure]()
- [API References]()
- [Setup & Installation]()

---

## About the site

## ✨ Features

## 🛠 Tech Stack

| Technology   | Purpose                                                        |
| ------------ | -------------------------------------------------------------- |
| React (Vite) | Render UI and component structure                              |
| CSS          | Styling and layout                                             |
| Express      | Backend server and API routing                                 |
| MongoDB      | Database to store users, profiles, pets, locations, and events |

## App Hierarchy 🪾

![app hierarchy]()

## ERD

![entity relationship diagram]()

## File Structure 📂

- frontend

  - src/
    - assets/ : for images used
    - components/ : page-specific or global features
    - context/ : for useContext
    - hooks/ : custom hooks
    - Modals/ : modals that appear in multiple pages
    - Pages/ : page-level components
    - Routes/ : rerouters
    - styles/ : styling and layout

- backend
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

- `PORT=<your port number>`
- `DATABASE=<your database>`
- `ACCESS_SECRET=<your JWT secret for your access token>`
- `REFRESH_SECRET=<your JWT secret for your refresh token>`

3. On the frontend/ directory, change the .env.example file to .env with the following:

- `VITE_SERVER=<your Vite proxy server>`

4. Install dependencies and run both servers
   **In the backend/ directory**
   1. `cd backend`
   2. `npm install`
   3. `npm run dev`
      **In the frontend/ directory**
   4. `cd frontend`
   5. `npm install`
   6. `npm run dev`
