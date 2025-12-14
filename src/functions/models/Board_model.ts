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


//---------------------- HERE START THE MODELS TO BOARD MEMBERS ---------------------------


export interface BoardMemberDTO{
    tableroId: string;
    usuarioId: string;
    rol: string;
}

export interface BoardMemberInfoDTO{
    id:string
    fechaIngreso:Date;
    tableroId: string;
    usuarioId: string;
    rol: string;
}


export interface BoardMemberInfo{
    id:string
    fechaIngreso:Date;
    tableroId: string;
    usuarioId: {
        id:string;
        nombre:string;
        apellido:string;
        email:string;
    }
    rol: string;
}