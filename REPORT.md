# Countries Explorer - Project Report

## Project Overview

Countries Explorer is a full-stack web application that allows users to explore information about countries around the world. The application integrates with external APIs for country data and includes features such as user authentication, favorites management, and responsive design.

## APIs Used

### REST Countries API

The primary external API used in this project is the REST Countries API (https://restcountries.com/), which provides detailed information about countries worldwide.

#### API Endpoints Used:

1. `GET /v3.1/all` - Retrieve information about all countries
2. `GET /v3.1/name/{name}` - Search for countries by name
3. `GET /v3.1/alpha/{code}` - Get country details by country code
4. `GET /v3.1/region/{region}` - Filter countries by region
5. `GET /v3.1/lang/{language}` - Filter countries by language

#### API Integration Strategy:

- Used Axios for making HTTP requests to the API
- Implemented caching with SWR to reduce redundant API calls
- Created utility functions to normalize and transform the API data for consistent use throughout the application

### Custom Backend API

The application also includes a custom-built RESTful API for user management and favorites functionality.

#### Key Endpoints:

1. Authentication

   - `POST /api/auth/register` - User registration
   - `POST /api/auth/login` - User login
   - `GET /api/auth/logout` - User logout
   - `GET /api/auth/me` - Get current user details

2. User Management

   - `PUT /api/users/profile` - Update user profile
   - `PUT /api/users/password` - Change user password

3. Favorites Management
   - `GET /api/favorites` - Get all favorite countries
   - `POST /api/favorites` - Add a country to favorites
   - `GET /api/favorites/:countryCode` - Check if a country is in favorites
   - `DELETE /api/favorites/:countryCode` - Remove a country from favorites

## Challenges and Solutions

### 1. API Integration

**Challenge**: The REST Countries API returns complex nested objects with inconsistent data structures. For example, some countries have multiple currencies, languages, or name variations.

**Solution**:

- Created adapter functions to normalize the API responses
- Implemented robust error handling for missing or inconsistent data
- Used TypeScript interfaces to define expected data structures
- Built fallback mechanisms for missing data points

### 2. User Authentication

**Challenge**: Implementing secure, persistent authentication across the application while maintaining a good user experience.

**Solution**:

- Used JSON Web Tokens (JWT) for authentication
- Implemented HTTP-only cookies for token storage to prevent XSS attacks
- Created a custom authentication context in React to manage auth state
- Used Next.js middleware for protected routes

### 3. State Management

**Challenge**: Managing application state efficiently, especially for filters, search queries, and favorites.

**Solution**:

- Used React Context API for global state that needs to be accessed by multiple components
- Implemented SWR for data fetching with built-in caching
- Used local component state for UI-specific state
- Created custom hooks for reusable state logic

### 4. Responsive Design

**Challenge**: Creating a consistent user experience across devices of different sizes.

**Solution**:

- Implemented a mobile-first design approach with Tailwind CSS
- Created responsive layouts with CSS Grid and Flexbox
- Used dynamic component rendering based on screen size
- Implemented touch-friendly interactions for mobile users

### 5. Performance Optimization

**Challenge**: Ensuring fast page loads and smooth interactions, especially when dealing with large datasets.

**Solution**:

- Implemented pagination for country listings
- Used lazy loading for images
- Optimized API calls with caching and debouncing
- Used Next.js static and server-side rendering where appropriate
- Implemented code splitting to reduce initial bundle size

## Testing Strategy

The project includes a comprehensive testing suite:

1. **Unit Tests**: Testing individual components and utility functions
2. **Integration Tests**: Testing interactions between components
3. **API Tests**: Testing backend API endpoints
4. **End-to-End Tests**: Testing complete user flows

## Future Improvements

Based on the challenges encountered, several improvements could be made in future iterations:

1. Implement more advanced caching strategies for API calls
2. Add more filter options (by currency, population, area, etc.)
3. Implement a global state management solution like Redux or Zustand
4. Add offline support with service workers
5. Implement more comprehensive error boundary handling
6. Add internationalization support
7. Implement a map view for visualizing country locations

## Conclusion

The Countries Explorer project successfully integrates external APIs with a custom backend to create a feature-rich application for exploring country data. Despite the challenges encountered, the application demonstrates effective solutions for authentication, state management, responsive design, and performance optimization.
