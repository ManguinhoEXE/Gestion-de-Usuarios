import { useNavigate } from 'react-router-dom';
import { logout as apiLogout } from '../services/auth';

export default function LogoutButton() {
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await apiLogout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <button type="button" className="btn-logout" onClick={onLogout}>
      <i className="bi bi-box-arrow-right"></i>
    </button>
  );
}