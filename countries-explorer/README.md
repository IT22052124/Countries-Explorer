# Countries Explorer Frontend

This is the frontend part of the Countries Explorer application, built with Next.js and React.

## Features

- Search for countries by name
- Filter countries by region and language
- View detailed information about each country
- User authentication (register, login, logout)
- Save favorite countries (for authenticated users)
- Dark mode support
- Responsive design for all screen sizes
- Comprehensive testing suite

## Technologies Used

- **Next.js 15** - React framework for server-side rendering and static site generation
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **SWR** - React hooks for data fetching
- **Jest & React Testing Library** - Testing frameworks

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd countries-explorer
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm start` - Starts the production server
- `npm run lint` - Runs the linter
- `npm test` - Runs the test suite
- `npm run test:watch` - Runs the test suite in watch mode
- `npm run test:coverage` - Runs the test suite with coverage reporting

## Project Structure

- `src/app/` - App router and page components
  - `page.jsx` - Home page
  - `login/` - Login page
  - `register/` - Registration page
  - `favorites/` - Favorites page
  - `profile/` - User profile page
  - `country/[code]/` - Country detail page
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions and API calls
- `src/context/` - React context providers
- `src/models/` - Data models and types
- `public/` - Static assets

## Features in Detail

### Country Data

The application uses the REST Countries API to fetch information about countries worldwide. Users can:

- View basic information about all countries on the home page
- Search for countries by name
- Filter countries by region and language
- View detailed information about a specific country

### User Authentication

The application includes a complete authentication system:

- Register a new account
- Login with email and password
- View and edit profile information
- Change password
- Logout

### Favorites

Authenticated users can:

- Add countries to their favorites list
- View all their favorite countries
- Remove countries from favorites

### Dark Mode

The application supports both light and dark themes, with automatic detection of system preferences and the ability to manually toggle between themes.

## Testing

Run the tests with:

```bash
npm test
```

The project includes:

- Unit tests for components
- Integration tests for component interactions
- API call mocking

## Deployment

Build the production version of the app:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Connecting to the Backend

The frontend communicates with the backend API through API service files. Update the `NEXT_PUBLIC_API_URL` environment variable to change the API endpoint.
