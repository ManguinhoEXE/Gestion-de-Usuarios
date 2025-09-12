import './pacientes.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createPaciente,
  listPacientes,
  deletePaciente as deletePacienteApi,
  updatePaciente,
} from '../services/pacientes';
import NavBar from '../components/NavBar';


const schema = z.object({
  numero_documento: z.string().min(3, 'Requerido'),
  tipo_documento: z.enum(['CC', 'TI', 'CE', 'PA'], { required_error: 'Requerido' }),
  primer_nombre: z.string().min(1, 'Requerido'),
  segundo_nombre: z.string().optional(),
  primer_apellido: z.string().min(1, 'Requerido'),
  segundo_apellido: z.string().optional(),
  fecha_nacimiento: z.string().min(1, 'Requerido'), 
  email: z.string().email('Email inválido'),
  telefono: z.string().min(7, 'Requerido'),
  direccion: z.string().min(3, 'Requerido'),
});

export default function Pacientes() {
  const [msg, setMsg] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const size = 5;
  const [totalPages, setTotalPages] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      numero_documento: '',
      tipo_documento: 'CC',
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      fecha_nacimiento: '',
      email: '',
      telefono: '',
      direccion: '',
    },
  });

  const load = async (p = page) => {
    try {
      setLoading(true);
      const data = await listPacientes({ page: p, size });
      setItems(data.data || []);
      setTotalPages(data.total_pages || 1);
      setMsg(`Total: ${data.total ?? (data.data?.length || 0)}`);
      setPage(p);
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Error cargando pacientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (form) => {
    setMsg('');
    try {
      if (editingId) {
        await updatePaciente(editingId, form);
        setMsg('Paciente actualizado');
      } else {
        await createPaciente(form);
        setMsg('Paciente creado');
      }
      reset();
      setEditingId(null);
      await load(1);
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Operación fallida');
    }
  };

  const onEdit = (p) => {
    setEditingId(p.id);
    Object.entries({
      numero_documento: p.numero_documento || '',
      tipo_documento: p.tipo_documento || 'CC',
      primer_nombre: p.primer_nombre || '',
      segundo_nombre: p.segundo_nombre || '',
      primer_apellido: p.primer_apellido || '',
      segundo_apellido: p.segundo_apellido || '',
      fecha_nacimiento: (p.fecha_nacimiento || '').slice(0, 10),
      email: p.email || '',
      telefono: p.telefono || '',
      direccion: p.direccion || '',
    }).forEach(([k, v]) => setValue(k, v));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onCancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const onDelete = async (id) => {
    if (!confirm('¿Eliminar paciente?')) return;
    try {
      await deletePacienteApi(id);
      await load(page);
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Error eliminando');
    }
  };

  return (
    <div className="manage-bg">
      <NavBar title="Gestionar" />
      <main className="manage-main">
        <div className="manage-wrapper">
        <section className="manage-card">
          <h2 className="manage-card-title">{editingId ? 'Editar paciente' : 'Crear paciente'}</h2>

          <form className="manage-form" onSubmit={handleSubmit(onSubmit)}>
            <label>
              <span>Documento</span>
              <input {...register('numero_documento')} placeholder="1234567890" />
              {errors.numero_documento && <small className="err">{errors.numero_documento.message}</small>}
            </label>

            <label>
              <span>Tipo</span>
              <select {...register('tipo_documento')}>
                <option value="CC">CC</option>
                <option value="TI">TI</option>
                <option value="CE">CE</option>
                <option value="PA">PA</option>
              </select>
              {errors.tipo_documento && <small className="err">{errors.tipo_documento.message}</small>}
            </label>

            <label>
              <span>Teléfono</span>
              <input {...register('telefono')} placeholder="3001234567" />
              {errors.telefono && <small className="err">{errors.telefono.message}</small>}
            </label>

            <label>
              <span>Dirección</span>
              <input {...register('direccion')} placeholder="Calle 123 #45-67" />
              {errors.direccion && <small className="err">{errors.direccion.message}</small>}
            </label>

            <label>
              <span>Fecha de nacimiento</span>
              <input type="date" {...register('fecha_nacimiento')} />
              {errors.fecha_nacimiento && <small className="err">{errors.fecha_nacimiento.message}</small>}
            </label>

            <label>
              <span>Primer nombre</span>
              <input {...register('primer_nombre')} />
              {errors.primer_nombre && <small className="err">{errors.primer_nombre.message}</small>}
            </label>

            <label>
              <span>Segundo nombre</span>
              <input {...register('segundo_nombre')} />
            </label>

            <label>
              <span>Primer apellido</span>
              <input {...register('primer_apellido')} />
              {errors.primer_apellido && <small className="err">{errors.primer_apellido.message}</small>}
            </label>

            <label>
              <span>Segundo apellido</span>
              <input {...register('segundo_apellido')} />
            </label>

            <label className="span-3">
              <span>Email</span>
              <input type="email" {...register('email')} placeholder="correo@dominio.com" />
              {errors.email && <small className="err">{errors.email.message}</small>}
            </label>

            <div className="manage-actions">
              {editingId && (
                <button type="button" className="btn-secondary" onClick={onCancelEdit}>
                  Cancelar
                </button>
              )}
              <button type="submit" className="btn-primary">
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>

          {msg && <div className="manage-msg">{msg}</div>}
        </section>

        <section className="manage-table">
          <h2 className="manage-table-title">Listado</h2>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>primer nombre</th>
                  <th>Segundo nombre</th>
                  <th>Primer apellido</th>
                  <th>Segundo apellido</th>
                  <th>Documento</th>
                  <th>Tipo</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.primer_nombre}</td>
                    <td>{p.segundo_nombre}</td>
                    <td>{p.primer_apellido}</td>
                    <td>{p.segundo_apellido}</td>
                    <td>{p.numero_documento}</td>
                    <td>{p.tipo_documento}</td>
                    <td>{p.direccion}</td>
                    <td>{p.telefono}</td>
                    <td>{p.email}</td>
                    <td className="td-actions">
                      <button className="btn-mini" onClick={() => onEdit(p)}>editar</button>
                      <button className="btn-danger-mini" onClick={() => onDelete(p.id)}>eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pager">
            <button onClick={() => load(Math.max(1, page - 1))} disabled={page <= 1}>
              Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button onClick={() => load(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
              Siguiente
            </button>
          </div>
        </section>
        </div>

      </main>
    </div>
  );
}