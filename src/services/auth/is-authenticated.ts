// Check if user is authenticated
export const isAuthenticated = (token: string | null): boolean => {
  return !!token;
};
