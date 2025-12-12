export interface BoardCreate{
    nombre:string;
    descripcion:string;
}

export interface BoardInfoDTO{
    id:string;
    nombre:string;
    ownerId:string;
    descripcion:string;
    fechaCreacion:Date;
    estado:string;
}

export interface BoardUpdateDTO{
    _id:string
    nombre: string;
    descripcion: string;
}