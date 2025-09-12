import './login.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../services/auth';
import logo from '../assets/logo.png';


const schema = z.object({
  email: z.string().min(1, 'Email requerido').email('Email inválido'),
  password: z.string().min(1, 'Password requerido'),
});

export default function Login() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });
  

  const onSubmit = async ({ email, password }) => {
    setMsg('');
    setLoading(true);
    try {
      await loginApi(email, password);
      navigate('/pacientes', { replace: true });
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Error iniciando sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <img className="login-logo" src={logo} alt="logo" />
          <h1 className="login-title">Iniciar Sesión</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="login-label">Email</label>
          <input
            type="email"
            placeholder="correo@dominio.com"
            className="login-input"
            {...register('email')}
          />
          {errors.email && <div className="error-msg">{errors.email.message}</div>}

          <label className="login-label">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            className="login-input"
            {...register('password')}
          />
          {errors.password && <div className="error-msg">{errors.password.message}</div>}

          <div className="login-actions">
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Ingresando…' : 'Iniciar'}
            </button>
            <div className="login-hint">
              ¿No tienes cuenta?{' '}
              <Link className="login-link" to="/register">Regístrate</Link>
            </div>
            {msg && <div className="error-msg">{msg}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}