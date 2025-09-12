const { Router } = require('express');
const {
  createPaciente,
  listPacientes,
  getPaciente,
  updatePaciente,
  deletePaciente,
} = require('../controllers/pacientes.controller');
const { authRequired } = require('../middlewares/auth');

const router = Router();

router.post('/', authRequired, createPaciente);
router.get('/', authRequired, listPacientes);
router.get('/:id', authRequired, getPaciente);
router.put('/:id', authRequired, updatePaciente);
router.delete('/:id', authRequired, deletePaciente);

module.exports = router;




