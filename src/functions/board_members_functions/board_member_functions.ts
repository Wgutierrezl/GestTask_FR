import api from "../ApiReutilizable";
import Swal from "sweetalert2";
import type { BoardInfoDTO, BoardMemberDTO, BoardMemberInfo, BoardMemberInfoDTO } from "../models/Board_model";


//METHOD TO GET ALL USERS_MEMBERS BY BOARD ID
export async function GetBoardsMemberByBoardId(boardId:string) : Promise<BoardMemberInfo[] | void> {
    try{
        const response=await api.get(`/api/boardMembers/getAllMemberByBoardId/${boardId}`);
        console.log(response.data);
        return response.data.map((item:any) : BoardMemberInfo => ({
            id: item._id,
            fechaIngreso: new Date(item.fechaIngreso),
            tableroId: item.tableroId,
            usuarioId: {
                id: item.usuarioId._id,
                nombre: item.usuarioId.nombre,
                apellido: item.usuarioId.apellido,
                email: item.usuarioId.correo,
            },
            rol: item.rol
        }));

    }catch(error:any){
        Swal.fire('Error',`ha ocurrido un error inesperado ${error.message ?? error}`);
        return ;
    }
    
}

//METHOD TO GET BOARD_MEMBER BY BOARD ID AND USER ID INTO THE TOKEN
export async function GetMembersBoardByBoardIdToken(boardId:string) : Promise<BoardMemberInfoDTO | void> {
    try{
        const response=await api.get(`/api/boardMembers/getMemberByBoardIdAndUser/${boardId}`);
        console.log(response.data);
        const item=response.data;
        return {
            id: item._id,
            fechaIngreso: new Date(item.fechaIngreso),
            tableroId: item.tableroId,
            usuarioId: item.usuarioId,
            rol: item.rol
        };

    }catch(error:any){
        Swal.fire('Error',`ha ocurrido un error inesperado ${error.message ?? error}`);
        return ;
    }
}

//METHOD TO ADD MEMBER INTO A BOARD
export async function AddBoardMember(data:BoardMemberDTO) : Promise<BoardInfoDTO | void> {
    try{
        const response=await api.post('/api/boardMembers/addMember',data);
        console.log(response.data);
        return response.data;

    }catch(error:any){
        Swal.fire('Error',`ha ocurrido un error inesperado ${error.message ?? error}`);
        return ;
    }
    
}