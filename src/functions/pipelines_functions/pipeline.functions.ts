import api from "../ApiReutilizable";
import Swal from "sweetalert2";
import type { pipelinesDTO } from "../models/Pipeline_model";
import type { PipelinesInfo } from "../models/Pipeline_model";



//METHOD TO CREATE PIPELINES
export async function CreatePipeline(data:pipelinesDTO, tableroId:string) : Promise<PipelinesInfo | void> {
    try{
        const response=await api.post(`/api/pipelines/createPipelines/boardId/${tableroId}` , data);
        console.log(response.data);
        return response.data;

    }catch(error:any){
        Swal.fire('error',`ha ocurrido un error inesperado ${error.message}`,'error');
        return ;
    }
    
}


//METHOD TO GET ALL PIPELINES BY BOARD ID
export async function GetPipelinesByBoardId(tableroId:string) : Promise<PipelinesInfo[] | void> {
    try{
        const response=await api.get(`/api/pipelines/getPipelinesByBoardId/${tableroId}`);
        console.log(response.data);
        return response.data.map((item:any) => ({
            id: item.id,
            nombre: item.nombre,
            descripcion: item.descripcion,
            tableroId: item.tableroId,
            estado: item.estado,
            etapas: item.etapas.map((etapa:any) => ({
                id: etapa._id,
                nombre: etapa.nombre,
                orden: etapa.orden
            })),
            fechaCreacion: new Date(item.fechaCreacion)
        }));

    }catch(error:any){
        Swal.fire('error',`ha ocurrido un error inesperado ${error.message}`,'error');
        return ;
    }
    
}


