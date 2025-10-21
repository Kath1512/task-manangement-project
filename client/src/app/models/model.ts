export type UserRole = 'developer' | 'admin' | 'leader';

export interface User{
    username: string;
    id: number;
    email: string
    role: UserRole;
    fullName: string;
    leaderId?: number;
    teamId?: number;
};

export interface IRegisterForm{
    username: string;
    password: string;
    email: string;
    role: UserRole;
    fullName: string;
}

export interface ILoginForm{
    username: string;
    password: string;
}

export interface IChangePasswordForm{
    id: number;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface APIResponse<T>{
    success: boolean;
    message: string;
    data?: T;
}

export type Status = 'Planned' | 'Completed' | 'In progress' | 'Cancelled';
export type DateFormat = `${number}${number}/${number}${number}/${number}${number}${number}${number}`;

export interface IProject{
    id: number;
    description: string;
    creator: string;
    leader: string;
    createdAt: string;
    status: Status;
    deadline: string;
    note: string;
    title: string;
    creatorId: number;
    leaderId: number;
}

export interface IProjectForm{
    title: string;
    description: string;
    status: Status;
    deadline: string;
    note: string;
    creatorId: number | undefined;
    leaderId: number | undefined;
    teamId: number | undefined;
}

export interface IEditProjectForm{
    title: string;
    description: string;
    status: Status;
    deadline: string;
    note: string;
}

export interface ColHeader<T>{
    key: keyof T;
    label: string;
}

export interface IStaff{
    fullName: string;
    id: number;
    email: string;
    role: UserRole;
}

export interface ISearchForm{
    title?: string;
    leader?: string;
}

export class cacheResponse<T> implements APIResponse<T> {
    success = true
    message: string
    data: T
    constructor(_message: string, _data: T){
        this.message = _message
        this.data = _data
    }
}

