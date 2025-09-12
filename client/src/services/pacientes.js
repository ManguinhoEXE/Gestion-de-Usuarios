import http from '../api/http';

export async function createPaciente(payload) {
  const { data } = await http.post('/pacientes', payload);
  return data;
}

export async function listPacientes({ page = 1, size = 10 } = {}) {
  const { data } = await http.get('/pacientes', { params: { page, size } });
  return data;
}

export async function getPaciente(id) {
  const { data } = await http.get(`/pacientes/${id}`);
  return data;
}

export async function updatePaciente(id, payload) {
  const { data } = await http.put(`/pacientes/${id}`, payload);
  return data;
}

export async function deletePaciente(id) {
  await http.delete(`/pacientes/${id}`);
}