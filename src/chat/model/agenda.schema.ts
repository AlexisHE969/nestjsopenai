import { Schema } from 'mongoose';

export const AgendaShema = new Schema(
  {
    nombre: { type: String },
    telefono: {
      type: String,
    },
    email: {
      type: String,
    },
    fecha: {
      type: String,
    },
    hora: {
      type: String,
    },
    mensajeCompleto: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false },
);
