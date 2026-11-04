import styled from '@emotion/styled';
import type { Tarea } from './tipos';

interface Props {
  tarea: Tarea;
  eliminar: (id: number) => void;
}

const Tarjeta = styled.div`
  background: white;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow-wrap: anywhere;
`;

const Boton = styled.button`
  padding: 9px 12px;
  cursor: pointer;
`;

function TareaItem({ tarea, eliminar }: Props) {
  return (
    <Tarjeta>
      <h2>{tarea.titulo}</h2>
      <p>{tarea.descripcion || 'Sin descripción'}</p>
      <p>Responsable: {tarea.responsable}</p>
      <Boton onClick={() => eliminar(tarea.id)}>Eliminar</Boton>
    </Tarjeta>
  );
}

export default TareaItem;
