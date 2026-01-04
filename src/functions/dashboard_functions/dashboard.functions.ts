import api from "../ApiReutilizable";
import Swal from "sweetalert2";
import type { DashboardBoardDTO, DashboardDTO, DashboardUserDTO } from "../models/Dashboard_model";

//FOR COMMENT
export async function getDashboardSummary() : Promise<DashboardDTO | void> {
    try{
        const response=await api.get<DashboardDTO>('/api/dashboard/getDashboardSummary');
        console.log(`dashboard generado ${response.data}`);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.status;
        if(statusCode===404 || statusCode===400){
            Swal.fire('error',`ha ocurrido un error inesperado ${error.message}`,'error');
            return;
        }

        throw error;

    }
    
}

// FOR COMMENT
export async function getUserDashboardByUserId(userId:string) : Promise<DashboardUserDTO | void> {
    try{
        const response=await api.get<DashboardUserDTO>(`/api/dashboard/getUserDashboardSummary/${userId}`);
        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.status;
        if(statusCode===400 || statusCode===404){
            Swal.fire('error',`ha ocurrido un error inesperado ${error.message}`,'error');
            return ;
        }

        throw error;

    }
    
}

//FOR COMMENT
export async function getUserBoardSummary(userId:string) : Promise<DashboardBoardDTO[] | void> {
    try{
        const response=await api.get<DashboardBoardDTO[]>(`/api/dashboard/getUserBoardDashboardSummary/${userId}`);
        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode=error.response.status;
        if(statusCode===400 || statusCode===404){
            Swal.fire('error',`ha ocurrido un error inesperado ${error.message}`,'error');
            return ;
        }

        throw error;
    }
    
}