import api from "../ApiReutilizable";
import Swal from "sweetalert2";
import type { TaskDTO, TaskInfoDTO } from "../models/Task_model";

//METHOD TO CREATE A TASK
export async function CreateTask(data:TaskDTO, boardId:string) : Promise<TaskInfoDTO | void> {
    try{
        const response=await api.post(`/api/tasks/createTask/boardId/${boardId}` , data);
        console.log(response.data);
        return  {
            id: response.data._id,
            titulo: response.data.titulo,
            descripcion: response.data.descripcion,
            pipelineId: response.data.pipelineId,
            etapaId: response.data.etapaId,
            asignadoA: response.data.asignadoA,
            prioridad: response.data.priodidad,
            estado: response.data.estado,
            fechaLimite: new Date(response.data.fechaLimite),
            fechaFinalizacion: new Date(response.data.fechaFinalizacion)
        };
    }catch(error:any){
        Swal.fire('error',`ha ocurrido un error inesperado ${error.message}`,'error');
        return ;
    }
}


//METHOD TO GET ALL TASKS BY PIPELINE ID
export async function GetTasksByPipelineId(pipelineId:string) : Promise<TaskInfoDTO[] | void> {
    try{
        const response=await api.get(`/api/tasks/getAllTaskByPipeId/${pipelineId}`);
        console.log(response.data);
        return response.data.map((item:any) => ({
            id: item._id,
            titulo: item.titulo,
            descripcion: item.descripcion,
            pipelineId: item.pipelineId,
            etapaId: item.etapaId,
            asignadoA: item.asignadoA,
            priodidad: item.priodidad,
            estado: item.estado,
            fechaLimite: new Date(item.fechaLimite),
            fechaFinalizacion: new Date(item.fechaFinalizacion)
        }));
    }catch(error:any){
        Swal.fire('error',`ha ocurrido un error inesperado ${error.message}`,'error');
        return ;
    }
}