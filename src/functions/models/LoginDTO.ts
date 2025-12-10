//MODEL TO LOG THE USER
export interface LoginDTO{
    email:string;
    password:string;
}

//MODEL TO GET SESSION BY USER
export interface SessionDTO{
    userId:string
    nombre:string;
    rol:string;
    token:string;
}