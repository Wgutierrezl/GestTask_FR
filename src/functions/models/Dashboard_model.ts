export interface DashboardDTO{
    totalBoards:number;
    totalPipelines:number;
    totalTask:number;
    totalComments:number;
    totalUsers:number;
}

export interface DashboardUserDTO{
    totalBoards:number;
    totalPipelines:number;
    totalTask:number;
    totalComments:number;
}

export interface DashboardBoardDTO{
    id:string;
    nombre:string;
    descripcion:string;
    ownerId:string
    estado:string
    totalPipelines:number;
    totalTask:number;
    totalMembers:number;
}