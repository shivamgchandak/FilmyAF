import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, token, status, error } = useSelector((s) => s.auth);
  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading: status === 'loading',
    error,
  };
};
