export type Prioridad = 'Baja' | 'Media' | 'Alta';
export type Estado = 'Inactivo' | 'Activo';


export interface TaskDTO{
    titulo:string
    descripcion: string
    pipelineId: string
    etapaId: string
    asignadoA: string
    prioridad: string
    fechaLimite: Date
    fechaFinalizacion: Date;
    tableroId:string
}


export interface TaskInfoDTO{
    id:string
    titulo:string
    descripcion: string
    pipelineId: string
    etapaId: string
    asignadoA: string
    prioridad: Prioridad
    estado: Estado
    fechaCreacion?: Date
    fechaLimite: Date
    fechaFinalizacion: Date;
}

export interface TaskUpdate{
    titulo:string
    descripcion: string
    asignadoA: string
    priodidad: Prioridad
    estado: Estado
    fechaLimite: Date
    fechaFinalizacion: Date;
}