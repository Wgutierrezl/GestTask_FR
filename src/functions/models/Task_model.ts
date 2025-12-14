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
    prioridad: string
    estado: string
    fechaLimite: Date
    fechaFinalizacion: Date;
}