"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateProjectStatus = exports.SearchProjects = exports.RemoveMemberFromProject = exports.AddMemberToProject = exports.GetProjectsByRole = exports.DeleteProject = exports.EditProject = exports.GetProjectById = exports.GetAllProjects = exports.CreateProject = void 0;

var _require = require("."),
    apiRequest = _require.apiRequest;

var CreateProject = function CreateProject(project) {
  return regeneratorRuntime.async(function CreateProject$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", apiRequest("post", "/api/projects/create-project", project));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.CreateProject = CreateProject;

var GetAllProjects = function GetAllProjects(filters) {
  return regeneratorRuntime.async(function GetAllProjects$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", apiRequest("post", "/api/projects/get-all-projects", filters));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.GetAllProjects = GetAllProjects;

var GetProjectById = function GetProjectById(id) {
  return regeneratorRuntime.async(function GetProjectById$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", apiRequest("post", "/api/projects/get-project-by-id", {
            _id: id
          }));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.GetProjectById = GetProjectById;

var EditProject = function EditProject(project) {
  return regeneratorRuntime.async(function EditProject$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", apiRequest("post", "/api/projects/edit-project", project));

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.EditProject = EditProject;

var DeleteProject = function DeleteProject(id) {
  return regeneratorRuntime.async(function DeleteProject$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt("return", apiRequest("post", "/api/projects/delete-project", {
            _id: id
          }));

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.DeleteProject = DeleteProject;

var GetProjectsByRole = function GetProjectsByRole(userId) {
  return regeneratorRuntime.async(function GetProjectsByRole$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          return _context6.abrupt("return", apiRequest("post", "/api/projects/get-projects-by-role", {
            userId: userId
          }));

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.GetProjectsByRole = GetProjectsByRole;

var AddMemberToProject = function AddMemberToProject(data) {
  return regeneratorRuntime.async(function AddMemberToProject$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          return _context7.abrupt("return", apiRequest("post", "/api/projects/add-member", data));

        case 1:
        case "end":
          return _context7.stop();
      }
    }
  });
};

exports.AddMemberToProject = AddMemberToProject;

var RemoveMemberFromProject = function RemoveMemberFromProject(data) {
  return regeneratorRuntime.async(function RemoveMemberFromProject$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          return _context8.abrupt("return", apiRequest("post", "/api/projects/remove-member", data));

        case 1:
        case "end":
          return _context8.stop();
      }
    }
  });
}; // 


exports.RemoveMemberFromProject = RemoveMemberFromProject;

var SearchProjects = function SearchProjects(searchData) {
  return regeneratorRuntime.async(function SearchProjects$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          return _context9.abrupt("return", apiRequest("post", "/api/projects/search-projects", searchData));

        case 1:
        case "end":
          return _context9.stop();
      }
    }
  });
}; // 
// 
// 
//  for check box 


exports.SearchProjects = SearchProjects;

var UpdateProjectStatus = function UpdateProjectStatus(projectId, status) {
  return regeneratorRuntime.async(function UpdateProjectStatus$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          return _context10.abrupt("return", apiRequest("post", "/api/projects/update-project-status", {
            _id: projectId,
            status: status
          }));

        case 1:
        case "end":
          return _context10.stop();
      }
    }
  });
};

exports.UpdateProjectStatus = UpdateProjectStatus;