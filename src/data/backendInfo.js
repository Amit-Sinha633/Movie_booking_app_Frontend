// Backend routes and middleware information for client dashboard
export const backendRoutes = [
  { method: 'GET', path: '/mba/api/v1/movie/movies', description: 'Get all movies' },
  { method: 'POST', path: '/mba/api/v1/movie/movies', description: 'Create a movie (admin/client)' },
  { method: 'GET', path: '/mba/api/v1/movie/movies/:movieId', description: 'Get movie by ID' },
  { method: 'PUT', path: '/mba/api/v1/movie/movies/:movieId', description: 'Update movie (admin/client)' },
  { method: 'PATCH', path: '/mba/api/v1/movie/movies/:movieId', description: 'Partial update movie (admin/client)' },
  { method: 'DELETE', path: '/mba/api/v1/movie/movies/:movieId', description: 'Delete movie (admin/client)' },
  // Add other routes as needed
];

export const backendMiddlewares = [
  { name: 'verifyJwt', description: 'Validates JWT token' },
  { name: 'isAdmin', description: 'Ensures user is ADMIN' },
  { name: 'isAdminOrClint', description: 'Allows ADMIN or CLIENT roles' },
  { name: 'validateMovieCreateRequest', description: 'Validates movie creation payload' },
  // Add other middleware names as needed
];
