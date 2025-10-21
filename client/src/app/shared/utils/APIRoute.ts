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
const editProjectRoute = `${host}/projects/edit-project`;

//user

const getUsersByTeamRoute = `${host}/users/teams`
const getLeadersRoute = `${host}/users/leaders`

export {host, registerRoute, loginRoute, changePasswordRoute,
    getProjectsRoute, addProjectRoute, editProjectRoute,
    getUsersByTeamRoute, getLeadersRoute
};
