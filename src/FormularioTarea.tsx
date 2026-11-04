import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from '@emotion/styled';
import type { Tarea } from './tipos';

interface Props {
  alGuardar: (tarea: Omit<Tarea, 'id'>) => void;
  alCancelar: () => void;
}

const Campo = styled.input`
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  margin: 10px 0;
`;

const Descripcion = styled.textarea`
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  margin: 10px 0;
`;

const Boton = styled.button`
  padding: 9px 12px;
  margin: 5px 5px 5px 0;
  cursor: pointer;
`;

function FormularioTarea({ alGuardar, alCancelar }: Props) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [responsable, setResponsable] = useState('');

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (titulo.trim() === '' || responsable.trim() === '') {
      alert('El título y el responsable son obligatorios.');
      return;
    }

    alGuardar({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      responsable: responsable.trim()
    });
  }

  return (
    <form onSubmit={enviar}>
      <label>Título</label>
      <Campo value={titulo} onChange={(e) => setTitulo(e.target.value)} required />

      <label>Descripción</label>
      <Descripcion value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

      <label>Responsable</label>
      <Campo value={responsable} onChange={(e) => setResponsable(e.target.value)} required />

      <Boton type="submit">Guardar</Boton>
      <Boton type="button" onClick={alCancelar}>Cancelar</Boton>
    </form>
  );
}

export default FormularioTarea;
