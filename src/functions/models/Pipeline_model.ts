export interface EtapasDTO{
    nombre:string
    orden:number
}

export interface EtapasInfoDTO{
    id:string
    nombre:string
    orden:number
}

export interface pipelinesDTO{
    nombre:string
    descripcion: string
    estado: string
    tableroId: string
    etapas: EtapasDTO[]
}

export interface PipelinesInfo{
    id:string
    nombre:string
    descripcion: string
    tableroId: string
    estado: string
    etapas: EtapasInfoDTO[]
    fechaCreacion?: Date
}


