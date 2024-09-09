const router = require("express").Router();

const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");
const cron = require('node-cron');
const moment = require('moment'); // To handle date and time comparison
const ScheduledTask = require("../models/scheduledTaskModel"); // Import the ScheduledTask model
const jwt = require("jsonwebtoken");
// **********************
const { addNotification } = require("../helpers/notificationHelper"); // Import the helper function
//********************** */


// db ghadi ndoz n5dem 3la notif ywssal inchaelah


// create a task
// Create a Map to store the cron jobs
const cronJobs = new Map();
router.post("/create-task", authMiddleware, async (req, res) => {
  try {
    if (req.body.scheduledTime === null) {
      const newTask = new Task(req.body);
      await newTask.save();
      res.send({
        success: true,
        message: "Task created successfully",
        data: newTask,
      });
    } else {
      const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.jwt_secret);
      const { scheduledTime, ...taskData } = req.body;

      const scheduledTask = new ScheduledTask({
        scheduledTime,
        taskData,
        createdBy: decoded.userId // Assign createdBy from decoded token
      });

      await scheduledTask.save();

      const job = cron.schedule('* * * * *', async function () {
        const now = moment();
        const scheduledMoment = moment(scheduledTask.scheduledTime);

        const task = await ScheduledTask.findById(scheduledTask._id);
        if (!task) {
          // Task was deleted
          this.stop();
          return;
        }

        if (now.isSameOrAfter(scheduledMoment) && !task.created) {
          const newTask = new Task(task.taskData);
          await newTask.save();

          console.log('Scheduled task created successfully at:', now.format());
          task.created = true;
          await task.save();
          // await ScheduledTask.findByIdAndDelete(task._id);

// *************************************
 // Send notification when task is actually created
 const project = await Project.findById(task.taskData.project).select('name');

 addNotification({
  title: `You have been assigned a new task in ${project.name}`,
  user: task.taskData.assignedTo,
  onClick: `/project/${task.taskData.project}`,
  description: task.taskData.description,
});
// *************************************






          this.stop();
        }
      });
      
      cronJobs.set(scheduledTask._id.toString(), job);

      res.send({
        success: true,
        message: "Task will be created at the scheduled time",
        scheduledTime: scheduledTime,
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});







// Get all scheduled tasks
router.get("/scheduled-tasks", authMiddleware, async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.jwt_secret);
    
    const scheduledTasks = await ScheduledTask.find({ createdBy: decoded.userId });
    res.send({
      success: true,
      message: "Scheduled tasks fetched successfully",
      data: scheduledTasks,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});



// Delete scheduled task
router.post("/delete-scheduled-task", authMiddleware, async (req, res) => {
  try {
    const jobId = req.body._id;
    await ScheduledTask.findByIdAndDelete(jobId);

    const job = cronJobs.get(jobId);
    if (job) {
      job.stop();
      cronJobs.delete(jobId);
    }

    res.send({
      success: true,
      message: "Scheduled task deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});



// Update scheduled task
router.post("/update-scheduled-task", authMiddleware, async (req, res) => {
  try {
    const { _id, scheduledTime, taskData } = req.body;

    // Find the existing scheduled task
    const scheduledTask = await ScheduledTask.findById(_id);

    if (!scheduledTask) {
      return res.send({
        success: false,
        message: "Scheduled task not found",
      });
    }

    // Stop the existing cron job if it exists
    const existingJob = cronJobs.get(_id);
    if (existingJob) {
      existingJob.stop();
      cronJobs.delete(_id);
    }

    // Update the scheduled task in the database
    scheduledTask.scheduledTime = scheduledTime;
    scheduledTask.taskData = taskData;
    await scheduledTask.save();

    // Schedule a new cron job with the updated time
    const job = cron.schedule('* * * * *', async function () {
      const now = moment();
      const scheduledMoment = moment(scheduledTask.scheduledTime);

      const task = await ScheduledTask.findById(scheduledTask._id);
      if (!task) {
        // Task was deleted
        this.stop();
        return;
      }

      if (now.isSameOrAfter(scheduledMoment) && !task.created) {
        const newTask = new Task(task.taskData);
        await newTask.save();

        console.log('Scheduled task created successfully at:', now.format());
        task.created = true;
        await task.save();

        this.stop();
      }
    });

    // Save the new cron job in the map
    cronJobs.set(scheduledTask._id.toString(), job);

    res.send({
      success: true,
      message: "Scheduled task updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});








// get all tasks
router.post("/get-all-tasks", authMiddleware, async (req, res) => {
  try {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === "all") {
        delete req.body[key];
      }
    });
    delete req.body["userId"];
    const tasks = await Task.find(req.body)
      .populate("assignedTo")
      .populate("assignedBy")
      .populate("project")
      .sort({ createdAt: -1 });
    res.send({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});










// update task
// router.post("/update-task", authMiddleware, async (req, res) => {
//   try {
//     await Task.findByIdAndUpdate(req.body._id, req.body);
//     res.send({
//       success: true,
//       message: "Task updated successfully",
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: error.message,
//     });
//   }
// });
// update task
router.post("/update-task", authMiddleware, async (req, res) => {
  try {
    const existingTask = await Task.findById(req.body._id);
    
    if (!existingTask) {
      return res.send({
        success: false,
        message: "Task not found",
      });
    }
    
    const oldStatus = existingTask.status;
    const newStatus = req.body.status;

    await Task.findByIdAndUpdate(req.body._id, req.body);

    if (oldStatus === newStatus || newStatus === undefined) {
      // Send notification if the status hasn't changed or if status is undefined
      const task = await Task.findById(req.body._id).populate('assignedTo');
      if (task.assignedTo) {
        addNotification({
          title: 'Task Updated',
          user: task.assignedTo._id,
          onClick: `/project/${existingTask.project}`,
          description: `The task "${task.name}" information has been updated.`,
        });
      }
    }

    res.send({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});









// delete task
router.post("/delete-task", authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.body._id);
    res.send({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// create multer storage
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});


// /////////////////////////// hada awel far9

// Create multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads'); // Define the destination folder where files will be stored
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Define the file name
//   },
// });
//////////////////////////////////








// router.post("/upload-image", authMiddleware, multer({ storage: storage }).single("file"), async (req, res) => {
//   try {
   
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "tasks",
//     });
//     const imageURL = result.secure_url;

//     await Task.findOneAndUpdate(
//       { _id: req.body.taskId },
//       {
//         $push: {
//           attachments: imageURL,
//         },
//       }
//     );

//     res.send({
//       success: true,
//       message: "Image uploaded successfully",
//       data: imageURL,
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: error.message,
//     });
//   }
// });

//  new one for multiple images 
// const storage = multer.diskStorage({});

const upload = multer({ storage });

router.post(
  "/upload-image",
  authMiddleware,
  upload.array("files", 10),
  async (req, res) => {
    try {
      const { taskId } = req.body;
      const files = req.files;

      const imageUploadPromises = files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "tasks",
        });
        return result.secure_url;
      });

      const uploadedImages = await Promise.all(imageUploadPromises);

      const task = await Task.findById(taskId);
      task.attachments.push(...uploadedImages);
      await task.save();

      res.send({
        success: true,
        message: "Images uploaded successfully",
        data: uploadedImages,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  }
);


// **********************************************************************
// Delete a scheduled task
router.delete("/scheduled-task/:id", authMiddleware, (req, res) => {
  try {
    const taskId = req.params.id;
    scheduledTasks = scheduledTasks.filter(task => task._id !== taskId);
    res.send({
      success: true,
      message: "Scheduled task deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Edit a scheduled task
router.put("/scheduled-task/:id", authMiddleware, (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedTask = req.body;
    scheduledTasks = scheduledTasks.map(task => 
      task._id === taskId ? { ...task, ...updatedTask } : task
    );
    res.send({
      success: true,
      message: "Scheduled task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});






module.exports = router;
// original code before schedule task now


// show schedule task is done الحمدلله donc had hna kolchi lhamdla 5edam mezyan blasst ma knt kan5azen tasks 
// scheduales ghy f array weli kan5azenhoom f database haka kandmn bli maghadich ydi3o w ghaybqaw dima kay-
// nin hta lhad lcomment hada lhamdlah kolchi fine kan9der nafficher schedualed tasks without any problem
// update and delete scheduale tasks added seccuessfully
// lhamdlah sla7t lmochkila dyal anah fch wahed task kictrea, katweli created w n9der nms7o mn schedule
//  .. wallakin ana khalito ma ytmsa7ch bghito ybqa w tweli tal3a created 

// now ill start fix delete .. 
// i fixed delete schedule task lhamdullilah .. 

// now ill start fix update date of schedule in edit 



// now i will start working on every one can see only they scheduale task im still here 




//  daba gahdi ndewz scheduled l profile




//  i will start fixing the error message in create scheduale task 



// ghadi nebda n5dem 3la notif f schedule task inchaelah .. 


//  ghadi nbda n5dem 3la dead line




//  ghadi nbd ngad issue dyal images 






// before schedule edit update




//  ana hna bch n5dem 3la fch yo9a3 update lwahd task ytserd wahed notif l user li te3ta lih had task .. .. 