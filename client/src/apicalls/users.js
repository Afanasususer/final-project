const { apiRequest } = require(".");

export const RegisterUser = async (payload) => apiRequest('post', '/api/users/register', payload);
export const LoginUser = async (payload) => apiRequest('post', '/api/users/login', payload);
export const GetLoggedInUser = async () => apiRequest('get', '/api/users/get-logged-in-user');


// fakeUser
export const SinginUser = async (payload) => apiRequest('post', '/api/users/login/new', payload);




// Delete user account
export const DeleteAccount = async () => apiRequest('delete', '/api/users/delete-account');


