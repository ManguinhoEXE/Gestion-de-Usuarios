import './login.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../services/auth';
import logo from '../assets/logo.png';

const schema = z
  .object({
    email: z.string().min(1, 'Email requerido').email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden',
  });

export default function Register() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async ({ email, password }) => {
    setMsg('');
    setLoading(true);
    try {
      await registerApi(email, password);
      reset();
      navigate('/pacientes', { replace: true });
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Error registrando');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <img className="login-logo" src={logo} alt="logo" />
          <h1 className="login-title">Regístrate</h1>
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

          <label className="login-label">Confirmar contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            className="login-input"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <div className="error-msg">{errors.confirmPassword.message}</div>}

          <div className="login-actions">
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Registrando…' : 'Crear cuenta'}
            </button>
            <div className="login-hint">
              ¿Ya tienes cuenta?{' '}
              <Link className="login-link" to="/login">Inicia sesión</Link>
            </div>
            {msg && <div className="error-msg">{msg}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}