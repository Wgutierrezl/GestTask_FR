import api from "../ApiReutilizable";
import Swal from "sweetalert2";
import type { UserInfo, UserCreate } from "../models/UserInfoDTO";
import type { LoginDTO, SessionDTO } from "../models/LoginDTO";


//METHOD TO LOG AN USER
export async function LogUser(data:LoginDTO) : Promise<SessionDTO | void> {
    try{
        const response=await api.post('/api/users/loginUser',data,
            {
                headers:{
                    skipAuth:true
                }
            }
        );
        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode = error.response?.status;

        if (statusCode === 500 || statusCode === 404) {
            Swal.fire("Error", "Usuario o contraseña incorrectos", "error");
            return;
        }

        throw error;
    }
    
}


//METHOD TO GET USER PROFILE BY ID
export async function GetProfile() : Promise<UserInfo | void> {
    try{
        const response=await api.get('/api/users/getProfile');
        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode = error.response?.status;

        if (statusCode === 500 || statusCode === 404) {
            Swal.fire("Error", "no logramos acceder a tu perfil", "error");
            return;
        }

        throw error;

    }
    
}


//METHOD TO REGISTER AN USER
export async function RegisterUser(data:UserCreate) : Promise<UserInfo | void> {
    try{
        const response=await api.post('/api/users/registerUser', data);
        console.log(response.data);
        return response.data;

    }catch(error:any){
        const statusCode = error.response?.status;

        if (statusCode === 500 || statusCode === 404) {
            Swal.fire("Error", "no hemos logrado crear el usuario", "error");
            return;
        }

        throw error;
    }
    
}





