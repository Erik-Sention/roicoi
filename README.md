# ROI Analysis Tool

A web application that digitizes a series of structured forms (Forms A–J) used to assess the economic impact of workplace psychological ill‐health and to compute the Return on Investment (ROI) for various interventions.

## Technologies Used

- **Frontend:** NextJS 14 with React, styled using Tailwind CSS v4 and Shadcn UI components
- **Backend:** Firebase (Firestore for data storage, Firebase Authentication via Gmail and MS Entra)
- **PDF Generation:** jsPDF for report generation

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- A Firebase project with Firestore and Authentication enabled

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd roicoi-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Firebase configuration details

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `src/app/(auth)`: Authentication-related pages (login, register)
- `src/app/dashboard`: Dashboard page for managing ROI analysis sessions
- `src/app/forms`: Forms A-J for ROI analysis
- `src/app/reports`: Report generation functionality
- `src/components`: Reusable UI components
- `src/lib/firebase`: Firebase configuration and utilities

## Features

- User authentication via Gmail and MS Entra
- Create, save, and manage multiple ROI analysis sessions
- Sequential form workflow (Forms A-J) with real-time calculations
- Generate professional PDF reports with ROI highlighted on the cover page
- Collaborative session management

## License

This project is licensed under the MIT License - see the LICENSE file for details.
