//CLASS TO CREATE A COMMET BECAUSE WE WAIT A FILE INTO THE ENDPOINT
export interface FileInputDTO{
    originalName?: string;
    buffer?: File;
    mimeType?: string;
    size?: number;
}

export interface CreateCommentDTO{
    tareaId: string;
    mensaje: string;
    archivos?: File[];
}


//CLASS TO GET THE COMMENT INFO
export interface FilesDTO{
    id: string;
    nombre: string;
    url: string;
    tamaño: string;
}

export interface CommentInfo{
    id: string;
    tareaId: string;
    usuario: {
        id: string;
        nombre: string;
        email: string;
        rol: string;
    }
    mensaje: string;
    archivos?: FilesDTO[]
    fechaCreacion?: Date;
}

//INTERFACE TO DOWNLOAD A FILE
export interface SessionFileDTO{
    userId: string;
    url: string;
}