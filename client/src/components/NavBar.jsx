import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import LogoutButton from './LogoutButton';

export default function NavBar({ title }) {
  const location = useLocation();

  const isPacientesPage = location.pathname === '/pacientes';
  const buttonClass = isPacientesPage ? 'manage-cta' : 'pacientes-cta';
  const buttonText = isPacientesPage ? '← Lista de pacientes' : 'Gestionar pacientes →';
  const buttonLink = isPacientesPage ? '/pacienteslist' : '/pacientes';

  return (
    <header className="pacientes-top">
      <img className="pacientes-logo" src={logo} alt="logo" />
      <h1 className="pacientes-title">{title}</h1>
      <div className="pacientes-actions">
        <LogoutButton />
      </div>
      <div className={buttonClass}>
        <Link className="btn-primary" to={buttonLink}>
          {buttonText}
        </Link>
      </div>
    </header>
  );
}