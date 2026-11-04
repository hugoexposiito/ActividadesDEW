import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import type { Tarea } from './tipos';
import FormularioTarea from './FormularioTarea';
import TareaItem from './Tarea';

const Contenedor = styled.main`
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Boton = styled.button`
  padding: 9px 12px;
  margin: 5px 5px 5px 0;
  cursor: pointer;
`;

const Buscador = styled.input`
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  margin: 10px 0;
`;

const Lista = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const FondoModal = styled.div`
  position: fixed;
  inset: 0;
  background: #0008;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
`;

const VentanaModal = styled.div`
  background: white;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  border-radius: 5px;
`;

function App() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarTareas() {
      try {
        const respuesta = await fetch('http://localhost:3000/tareas');

        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar las tareas.');
        }

        const datos = await respuesta.json();
        setTareas(datos);
      } catch (error) {
        setError('Error al cargar las tareas. Comprueba que JSON Server está iniciado.');
      } finally {
        setCargando(false);
      }
    }

    cargarTareas();
  }, []);

  const tareasFiltradas = tareas.filter((tarea) =>
    tarea.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  useEffect(() => {
    document.title = `Lista de tareas (${tareasFiltradas.length}/${tareas.length})`;
  }, [tareasFiltradas.length, tareas.length]);

  async function agregarTarea(datos: Omit<Tarea, 'id'>) {
    try {
      const respuesta = await fetch('http://localhost:3000/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      if (!respuesta.ok) {
        throw new Error('No se pudo guardar la tarea.');
      }

      const nuevaTarea = await respuesta.json();
      setTareas([...tareas, nuevaTarea]);
      setMostrarFormulario(false);
      setError('');
    } catch (error) {
      setError('Error al guardar la tarea.');
    }
  }

  async function eliminarTarea(id: number) {
    try {
      const respuesta = await fetch(`http://localhost:3000/tareas/${id}`, {
        method: 'DELETE'
      });

      if (!respuesta.ok) {
        throw new Error('No se pudo eliminar la tarea.');
      }

      setTareas(tareas.filter((tarea) => tarea.id !== id));
      setError('');
    } catch (error) {
      setError('Error al eliminar la tarea.');
    }
  }

  return (
    <Contenedor>
      <h1>Lista de tareas</h1>

      <Boton onClick={() => setMostrarFormulario(true)}>Nueva tarea</Boton>

      <Buscador
        type="text"
        placeholder="Buscar por título"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <p>Mostrando {tareasFiltradas.length} de {tareas.length} tareas</p>

      {error && <p>{error}</p>}
      {cargando ? (
        <p>Cargando tareas...</p>
      ) : tareasFiltradas.length === 0 ? (
        <p>{busqueda ? 'No se encontraron tareas.' : 'Todavía no hay tareas.'}</p>
      ) : (
        <Lista>
          {tareasFiltradas.map((tarea) => (
            <TareaItem key={tarea.id} tarea={tarea} eliminar={eliminarTarea} />
          ))}
        </Lista>
      )}

      {mostrarFormulario && (
        <FondoModal>
          <VentanaModal>
            <h2>Nueva tarea</h2>
            <FormularioTarea
              alGuardar={agregarTarea}
              alCancelar={() => setMostrarFormulario(false)}
            />
          </VentanaModal>
        </FondoModal>
      )}
    </Contenedor>
  );
}

export default App;
