import api from "../ApiReutilizable";
import type { BoardCreate } from "../models/Board_model";
import type { BoardInfoDTO } from "../models/Board_model";
import Swal from "sweetalert2";


//METHOD TO CREATE A BOARD
export async function CreateBoard(data:BoardCreate) : Promise<BoardInfoDTO | void> {
    try{
        const response=await api.post('/api/boards/createBoard',data);
        console.log(response.data);
        return response.data;

    }catch(error:any){
        Swal.fire('Error',`ha ocurrido un error inesperado ${error.message ?? error}`);
        return ;
    }
    
}

//METHOD TO GET MY BOARDS
export async function GetMyBoards() : Promise<BoardInfoDTO[] | void> {
    try{
        const response=await api.get('/api/boards/getMyBoards');
        console.log(response.data);
        return response.data.map((b: any) => ({
            id: b._id,
            nombre: b.nombre,
            descripcion: b.descripcion,
            ownerId: b.ownerId,
            fechaCreacion: new Date(b.fechaCreacion),
            estado: b.estado
        }));
    }catch(error:any){
        Swal.fire('Error',`ha ocurrido un error inesperado ${error.message ?? error}`);
        return ;
    }
    
}