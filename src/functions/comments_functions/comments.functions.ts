import api from "../ApiReutilizable";
import Swal from "sweetalert2";
import type { CommentInfo, CreateCommentDTO, SessionFileDTO } from "../models/comment_model";


//METHOD TO ADD A COMMENT WITH FILES TO A TASK
export async function AddComment(data:CreateCommentDTO, boardId: string) : Promise<CommentInfo | void> {
    try {
        const formData = new FormData();
        // Campos normales
        formData.append("tareaId", data.tareaId);
        formData.append("mensaje", data.mensaje);

        // Archivos (array)
        if (data.archivos && data.archivos.length > 0) {
            data.archivos.forEach((file) => {
                if (file) {
                    formData.append("archivos", file);
                }
            });
        }
        const response = await api.post( `/api/comments/createComment/boardId/${boardId}`, formData,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log(response.data)
        return {
            id: response.data._id,
            tareaId: response.data.tareaId,
            usuario: {
                id: response.data.usuarioId._id,
                nombre: response.data.usuarioId.nombre,
                email: response.data.usuarioId.correo,
                rol: response.data.usuarioId.rol
            },
            mensaje: response.data.mensaje,
            archivos: response.data.archivos?.map((file: any) => ({
                id: file._id,
                nombre: file.nombre,
                url: file.url,
                tamaño: file.tamaño
            })) || [],
            fechaCreacion: response.data.fechaCreacion
        };
    }catch (error) {
        console.error("Error adding comment:", error);
        Swal.fire("Error", "There was an error adding the comment.", "error");
    }
}

//METHOD TO GET ALL COMMENTS BY TASK ID
export async function GetCommentsByTaskId(taskId:string) : Promise<CommentInfo[] | void> {
    try{
        const response=await api.get(`/api/comments/getAllCommentsByTaskId/${taskId}`);
        console.log(response.data);
        return response.data.map((comment: any) => ({
            id: comment._id,
            tareaId: comment.tareaId,
            usuario: {
                id: comment.usuarioId._id,
                nombre: comment.usuarioId.nombre,
                email: comment.usuarioId.correo,
                rol: comment.usuarioId.rol
            },
            mensaje: comment.mensaje,
            archivos: comment.archivos?.map((file: any) => ({
                id: file._id,
                nombre: file.nombre,
                url: file.url,
                tamaño: file.tamaño
            })) || [],
            fechaCreacion: comment.fechaCreacion
        }));

    }catch(error:any){
        Swal.fire('Error',`ha ocurrido un error inesperado ${error.message ?? error}`);
        return ;
    }
}


//METHOD TO DOWNLOAD A FILE BY ITS URL
export async function DownloadFileByUrl(commentId:string, fileId:string) : Promise<SessionFileDTO | void> {
    try{
        const response=await api.get<SessionFileDTO>(`/api/comments/downloadFile/${commentId}/file/${fileId}`);
        console.log(response.data);
        return response.data;
    }catch(error:any){
        Swal.fire('Error',`ha ocurrido un error inesperado ${error.message ?? error}`);
        return ;
    }
}
    