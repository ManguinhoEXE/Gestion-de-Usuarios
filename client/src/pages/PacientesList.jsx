import './pacientes.css';
import { useEffect, useState } from 'react';
import { listPacientes, getPaciente } from '../services/pacientes'; 
import NavBar from '../components/NavBar';

// ===== Página: Lista de Pacientes =====
export default function PacientesList() {
  // ----- Estado: datos, mensajes, carga -----
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // ----- Estado: paginación -----
  const [page, setPage] = useState(1);
  const size = 4;
  const [totalPages, setTotalPages] = useState(1);

  // ----- Estado: filtro por ID -----
  const [filterId, setFilterId] = useState('');

  // ----- Carga de datos (paginado o por ID) -----
  const load = async (p = page) => {
    try {
      setLoading(true);
      const id = (filterId || '').trim();

      if (id) {
        // Buscar 1 paciente por ID
        try {
          const one = await getPaciente(id);
          const rows = one ? [one] : [];
          setItems(rows);
          setTotalPages(1);
          setPage(1);
          setMsg(rows.length ? '1 resultado' : 'Sin resultados');
        } catch (e) {
          if (e?.response?.status === 404) {
            setItems([]);
            setTotalPages(1);
            setPage(1);
            setMsg('Paciente no encontrado');
          } else {
            throw e;
          }
        }
      } else {
        // Listado paginado
        const data = await listPacientes({ page: p, size });
        const rows = data.data || [];
        const total = data.total ?? rows.length;
        setItems(rows.slice(0, size));
        setTotalPages(data.total_pages ?? Math.max(1, Math.ceil(total / size)));
        setPage(p);
        setMsg(`Total: ${total}`);
      }
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Error cargando pacientes');
    } finally {
      setLoading(false);
    }
  };

  // ----- Efecto: carga inicial -----
  useEffect(() => {
    load(1);
  }, []);

  // ----- Util: formateo de fecha -----
  const formatDate = (s) => {
    if (!s) return '-';
    const d = new Date(s);
    return Number.isNaN(d.getTime())
      ? s
      : d.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // ----- Util: nombre completo -----
  const fullName = (p) =>
    [p.primer_nombre, p.segundo_nombre, p.primer_apellido, p.segundo_apellido]
      .filter(Boolean)
      .join(' ');

  // ----- Util: páginas a mostrar -----
  const pages = (() => {
    const total = Math.min(totalPages, 10);
    return Array.from({ length: total }, (_, i) => i + 1);
  })();

  // ===== Render =====
  return (
    <div className="pacientes-bg">
      {/* Nav con título de sección */}
      <NavBar title="Pacientes" />

      <main className="pacientes-main">
        <div className="pacientes-container">

          {/* Toolbar de filtro por ID */}
          <div className="pacientes-toolbar">
            <input
              type="number"
              min="0"
              className="input-filter"
              placeholder="Filtrar por ID…"
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load(1)}
            />
            <button className="btn-primary" onClick={() => load(1)}>Buscar</button>
            {filterId && (
              <button
                className="btn-clear"
                onClick={() => { setFilterId(''); load(1); }}
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Lista: skeleton o tarjetas */}
          {loading ? (
            <div className="pacientes-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="paciente-card skeleton" />
              ))}
            </div>
          ) : (
            <div className="pacientes-grid">
              {items.map((p) => (
                <article key={p.id} className="paciente-card">
                  <h3>{fullName(p)}</h3>
                  <div className="paciente-fields">
                    <div className="label">ID</div>
                    <div className="value">{p.id ?? '-'}</div>
                    <div className="label">Número documento</div>
                    <div className="value">{p.numero_documento ?? '-'}</div>
                    <div className="label">Tipo documento</div>
                    <div className="value">{p.tipo_documento ?? '-'}</div>
                    <div className="label">Fecha de nacimiento</div>
                    <div className="value">{formatDate(p.fecha_nacimiento)}</div>
                    <div className="label">Email</div>
                    <div className="value">{p.email ?? '-'}</div>
                    <div className="label">Teléfono</div>
                    <div className="value">{p.telefono ?? '-'}</div>
                    <div className="label">Dirección</div>
                    <div className="value">{p.direccion ?? '-'}</div>
                    <div className="label">Fecha de registro</div>
                    <div className="value">
                      {formatDate(p.fecha_registro || p.created_at || p.fecha_creacion)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Paginación inferior */}
          <nav className="pagination">
            <button
              className="page-nav"
              disabled={page <= 1}
              onClick={() => load(page - 1)}
            >
              Anterior
            </button>

            <ul className="page-list">
              {pages.map((n) => (
                <li key={n}>
                  <button
                    className={`page-btn ${n === page ? 'is-current' : ''}`}
                    aria-current={n === page ? 'page' : undefined}
                    onClick={() => load(n)}
                  >
                    {n}
                  </button>
                </li>
              ))}
            </ul>

            <button
              className="page-nav"
              disabled={page >= totalPages}
              onClick={() => load(page + 1)}
            >
              Siguiente
            </button>
          </nav>

          {/* Mensaje de estado */}
          <div className="pacientes-msg">{msg}</div>
        </div>
      </main>
    </div>
  );
}