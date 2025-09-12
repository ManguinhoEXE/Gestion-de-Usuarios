import './login.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../services/auth';
import logo from '../assets/logo.png';

// ===== Validación (zod) =====
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

// ===== Página: Registro =====
export default function Register() {
  // ----- Navegación y estado local -----
  const navigate = useNavigate();
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // ----- Efecto: bloquear scroll en esta vista -----
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  // ----- Form: setup + validación -----
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  // ----- Submit: llama API y redirige -----
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

  // ===== UI: layout, encabezado y formulario =====
  return (
    <div className="login-bg">{/* Fondo */}
      <div className="login-card">{/* Tarjeta */}
        {/* Encabezado: logo + título */}
        <div className="login-header">
          <img className="login-logo" src={logo} alt="logo" />
          <h1 className="login-title">Regístrate</h1>
        </div>

        {/* Formulario */}
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <label className="login-label">Email</label>
          <input
            type="email"
            placeholder="correo@dominio.com"
            className="login-input"
            {...register('email')}
          />
          {errors.email && <div className="error-msg">{errors.email.message}</div>}

          {/* Contraseña */}
          <label className="login-label">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            className="login-input"
            {...register('password')}
          />
          {errors.password && <div className="error-msg">{errors.password.message}</div>}

          {/* Confirmar contraseña */}
          <label className="login-label">Confirmar contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            className="login-input"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <div className="error-msg">{errors.confirmPassword.message}</div>}

          {/* Acciones: enviar + enlace */}
          <div className="login-actions">
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Registrando…' : 'Crear cuenta'}
            </button>
            <div className="login-hint">
              ¿Ya tienes cuenta? <Link className="login-link" to="/login">Inicia sesión</Link>
            </div>
            {msg && <div className="error-msg">{msg}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}