import api from "../ApiReutilizable";
import Swal from "sweetalert2";
import type { BoardInfoDTO, BoardMemberDTO } from "../models/Board_model";


//METHOD TO GET ALL USERS_MEMBERS BY BOARD ID
export async function GetBoardsMemberByBoardId(boardId:string) : Promise<BoardInfoDTO | void> {
    try{
        const response=await api.get(`/api/boardMembers/getAllMemberByBoardId/${boardId}`);
        console.log(response.data);
        return response.data;

    }catch(error:any){
        Swal.fire('Error',`ha ocurrido un error inesperado ${error.message ?? error}`);
        return ;
    }
    
}

//METHOD TO GET BOARD_MEMBER BY BOARD ID AND USER ID INTO THE TOKEN
export async function GetMembersBoardByBoardIdToken(boardId:string) {
    try{
        const response=await api.get(`/api/boardMembers/getMemberByBoardIdAndUser/${boardId}`);
        console.log(response.data);
        return response.data;

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