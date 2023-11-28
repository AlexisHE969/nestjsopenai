import { Document } from 'mongoose';

export interface Agenda extends Document {
  nombre: string;
  telefono: string;
  email: string;
  fecha: string;
  hora: string;
  mensajeCompleto: string;
}
