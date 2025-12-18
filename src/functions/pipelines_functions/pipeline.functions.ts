import api from "../ApiReutilizable";
import Swal from "sweetalert2";
import type { pipelinesDTO } from "../models/Pipeline_model";
import type { PipelinesInfo } from "../models/Pipeline_model";



//METHOD TO CREATE PIPELINES
export async function CreatePipeline(data:pipelinesDTO, tableroId:string) : Promise<PipelinesInfo | void> {
    try{
        const response=await api.post(`/api/pipelines/createPipelines/boardId/${tableroId}` , data);
        console.log(response.data);
        return {
            id:response.data._id,
            nombre:response.data.nombre,
            descripcion:response.data.descripcion,
            tableroId:response.data.tableroId,
            estado:response.data.estado,
            etapas:response.data.etapas.map((item:any) => ({
                id:item._id,
                nombre:item.nombre,
                orden:item.orden
            })),
            fechaCreacion: new Date(response.data.fechaCreacion)
        };

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

//METHOD TO DELETE A PIPELINE BY ID
export async function DeletePipelineById(pipelineId:string, boardId:string) : Promise<boolean> {
    try{
        const response=await api.delete(`/api/pipelines/deletePipelinesById/${pipelineId}/boardId/${boardId}`);
        return response.status === 204;

    }catch(error:any){
        const status = error.response?.status;
        if (status === 404) {
            Swal.fire('error','Pipeline no encontrado','error');
            return false;
        } else {
            Swal.fire('error',`ha ocurrido un error inesperado ${error.message}`,'error');
            return false;
        }
    }
    
}


