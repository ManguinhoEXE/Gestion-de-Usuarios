import './login.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../services/auth';
import logo from '../assets/logo.png';

// ===== Esquema de validación (zod) =====
const schema = z.object({
  email: z.string().min(1, 'Email requerido').email('Email inválido'),
  password: z.string().min(1, 'Password requerido'),
});

export default function Login() {
  // ===== Hooks de navegación y estado local =====
  const navigate = useNavigate();
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // ===== Efecto: bloquear scroll de fondo en la vista de login =====
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  // ===== Form: registro de campos + validación =====
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  // ===== Submit: llama API, maneja errores y redirige =====
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

  // ===== Render: layout, encabezado y formulario =====
  return (
    <div className="login-bg">{/* Fondo/centro */}
      <div className="login-card">{/* Tarjeta del login */}
        {/* Encabezado: logo + título */}
        <div className="login-header">
          <img className="login-logo" src={logo} alt="logo" />
          <h1 className="login-title">Iniciar Sesión</h1>
        </div>

        {/* Formulario: email y contraseña */}
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Campo email */}
          <label className="login-label">Email</label>
          <input
            type="email"
            placeholder="correo@dominio.com"
            className="login-input"
            {...register('email')}
          />
          {errors.email && <div className="error-msg">{errors.email.message}</div>}

          {/* Campo contraseña */}
          <label className="login-label">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            className="login-input"
            {...register('password')}
          />
          {errors.password && <div className="error-msg">{errors.password.message}</div>}

          {/* Acciones: enviar y enlace a registro + mensaje de error */}
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