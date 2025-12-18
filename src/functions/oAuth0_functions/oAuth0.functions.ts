/* import api from "../ApiReutilizable"; */
import auth0Api from "../auth0Api";
import Swal from "sweetalert2";
import type { SessionDTO } from "../models/LoginDTO";

//METHOD TO LOG USER WITH OAUTH0
export async function loginWithOauth0Backend(auth0Token:string) : Promise<SessionDTO> {
    try{
        console.log('Auth0 token:', auth0Token);
        const response=await auth0Api.post('/api/users/oauth/oauth0',{},{
            headers:{
                Authorization: `Bearer ${auth0Token}`
            }
        });
        console.log(response.data);
        return {
            userId:response.data.userId,
            nombre:response.data.nombre,
            rol:response.data.rol,
            token:response.data.token
        }

    }catch(error:any){
        Swal.fire('error', `ha ocurrido un error inesperado ${error}`,'error');
        throw error;

    }
    
}