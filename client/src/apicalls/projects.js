const { apiRequest } = require(".");

export const CreateProject = async (project) => apiRequest("post", "/api/projects/create-project", project);

export const GetAllProjects = async (filters) => apiRequest("post", "/api/projects/get-all-projects", filters);

export const GetProjectById = async (id) => apiRequest("post", "/api/projects/get-project-by-id", { _id: id });

export const EditProject = async (project) => apiRequest("post", "/api/projects/edit-project", project);

export const DeleteProject = async (id) => apiRequest("post", "/api/projects/delete-project", { _id: id });

export const GetProjectsByRole = async (userId) => apiRequest("post", "/api/projects/get-projects-by-role", { userId });

export const AddMemberToProject = async (data) => apiRequest("post", "/api/projects/add-member", data);

export const RemoveMemberFromProject = async (data) => apiRequest("post", "/api/projects/remove-member", data);


// 
export const SearchProjects = async (searchData) => apiRequest("post", "/api/projects/search-projects", searchData);
// 


// 

// 


//  for check box 
export const UpdateProjectStatus = async (projectId, status) => 
  apiRequest("post", "/api/projects/update-project-status", { _id: projectId, status });
