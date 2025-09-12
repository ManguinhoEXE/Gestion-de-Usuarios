import "./App.css";
import { Routes, Route, Navigate} from "react-router-dom";
import Login from './pages/Login';
import Pacientes from "./pages/Pacientes";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from './pages/Register';
import PacientesList from './pages/PacientesList';



export default function App() {
  return (

      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/pacienteslist"
          element={
            <ProtectedRoute>
              <PacientesList />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/pacientes"
          element={
            <ProtectedRoute>
              <Pacientes />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}
