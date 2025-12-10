//MODEL TO GET THE USER INFO 
export interface UserInfo{
    _id:string;
    nombre:string;
    correo:string;
    edad:number;
    rol:string
}


//MODEL TO REGISTER USER
export interface UserCreate{
    nombre:string;
    correo:string;
    edad:number;
    contrasena:string;
    rol:string
}