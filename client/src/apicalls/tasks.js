import { apiRequest } from ".";

export const CreateTask = async (task) =>
  apiRequest("post", "/api/tasks/create-task", task);

export const GetAllTasks = async (filters) =>
  apiRequest("post", "/api/tasks/get-all-tasks", filters);

export const UpdateTask = async (task) =>
  apiRequest("post", "/api/tasks/update-task", task);

export const DeleteTask = async (id) =>
  apiRequest("post", "/api/tasks/delete-task", { _id: id });

export const UploadImage = async (payload) => {
  return apiRequest("post", "/api/tasks/upload-image", payload);
};




// show schdeuled tasks 
// Existing functions...

export const GetScheduledTasks = async () =>
  apiRequest("get", "/api/tasks/scheduled-tasks");

// show schedule task is done الحمدلله donc had hna kolchi lhamdla 5edam mezyan blasst ma knt kan5azen tasks 
// scheduales ghy f array weli kan5azenhoom f database haka kandmn bli maghadich ydi3o w ghaybqaw dima kay-
// nin hta lhad lcomment hada lhamdlah kolchi fine kan9der nafficher schedualed tasks without any problem

export const DeleteScheduledTask = async (id) =>
  apiRequest("post", "/api/tasks/delete-scheduled-task", { _id: id });

export const UpdateScheduledTask = async (task) =>
  apiRequest("post", "/api/tasks/update-scheduled-task", task);



// update and delete scheduale tasks added seccuessfully

//  i will start working on kol wahed ychof its own schedule tasks 


//  ghadi nbda n5dem 3la dead line  




//  ghadi nbd ngad issue dyal images 

// before schedule edit update 