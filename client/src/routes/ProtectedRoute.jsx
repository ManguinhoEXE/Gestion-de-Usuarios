import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { me } from '../services/auth';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await me();
        if (active) setAllowed(true);
      } catch {
        if (active) setAllowed(false);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading) return <div>Verificando sesión...</div>;
  if (!allowed) return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
}