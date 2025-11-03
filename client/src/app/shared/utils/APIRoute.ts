import { environment } from "../../../environments/environment";

const host = environment.apiUrl;
console.log(host);

//auth

const registerRoute = `${host}/auth/register`;
const loginRoute = `${host}/auth/login`;
const changePasswordRoute = `${host}/auth/change-password`;

//project

const getProjectsRoute = `${host}/projects`;
const addProjectRoute = `${host}/projects/add-project`;
const projectRoute = `${host}/projects`;

//user

const getUsersRoute = `${host}/users`

export {host, registerRoute, loginRoute, changePasswordRoute,
    getProjectsRoute, addProjectRoute, projectRoute,
    getUsersRoute
};
