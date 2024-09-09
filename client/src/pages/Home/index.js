import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetProjectsByRole, SearchProjects } from "../../apicalls/projects";
import { SetLoading } from "../../redux/loadersSlice";
import {
  message,
  Input,
  Button as AntButton,
  Divider as AntDivider,
} from "antd";
import { getDateFormat } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowForward } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Button,
  CardActions,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "react-slick";

function Home() {
  const [projects, setProjects] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [filter, setFilter] = useState("all");

  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ownerProjects = projects.filter(
    (project) => project.owner._id === user._id
  );

  const [completedProjectsCount, setCompletedProjectsCount] = useState(0);
  const [ongoingProjectsCount, setOngoingProjectsCount] = useState(0);

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetProjectsByRole(user._id);
      dispatch(SetLoading(false));
      if (response.success) {
        const completedProjectsCount = response.data.filter(
          (project) => project.status.toLowerCase() === "complete"
        ).length;
        const ongoingProjectsCount = response.data.filter(
          (project) => project.status.toLowerCase() === "active"
        ).length;
        setProjects(response.data);
        setCompletedProjectsCount(completedProjectsCount);
        setOngoingProjectsCount(ongoingProjectsCount);

        // Update recent projects after setting the projects state
        updateRecentProjects(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  // Debounce function to delay the execution of handleSearch
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleSearch = async (value) => {
    try {
      setSearching(true);
      const response = await SearchProjects({
        searchQuery: value,
        userId: user._id,
      });
      setSearching(false);
      if (response.success) {
        setProjects(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setSearching(false);
      message.error(error.message);
    }
  };

  // Use useCallback to memoize the debounced search function
  const debouncedHandleSearch = useCallback(debounce(handleSearch, 500), []);

  const saveRecentProject = (project) => {
    const recentProjectsKey = `recentProjects_${user._id}`;
    let recentProjects =
      JSON.parse(localStorage.getItem(recentProjectsKey)) || [];
    recentProjects = recentProjects.filter((p) => p._id !== project._id); // Remove duplicates
    recentProjects.unshift(project); // Add to the top
    if (recentProjects.length > 4) {
      recentProjects.pop(); // Keep only the last 4
    }
    localStorage.setItem(recentProjectsKey, JSON.stringify(recentProjects));
    setRecentProjects(recentProjects);
  };

  const removeRecentProject = (projectId) => {
    const recentProjectsKey = `recentProjects_${user._id}`;
    let recentProjects =
      JSON.parse(localStorage.getItem(recentProjectsKey)) || [];
    recentProjects = recentProjects.filter((p) => p._id !== projectId);
    localStorage.setItem(recentProjectsKey, JSON.stringify(recentProjects));
    setRecentProjects(recentProjects);
  };

  const updateRecentProjects = (allProjects) => {
    const recentProjectsKey = `recentProjects_${user._id}`;
    let recentProjects =
      JSON.parse(localStorage.getItem(recentProjectsKey)) || [];
    recentProjects = recentProjects.filter((recentProject) =>
      allProjects.some((project) => project._id === recentProject._id)
    );
    localStorage.setItem(recentProjectsKey, JSON.stringify(recentProjects));
    setRecentProjects(recentProjects);
  };

  const handleProjectClick = (project) => {
    saveRecentProject(project);
    navigate(`/project/${project._id}`);
  };

  useEffect(() => {
    getData();
    const recentProjectsKey = `recentProjects_${user._id}`;
    const storedRecentProjects =
      JSON.parse(localStorage.getItem(recentProjectsKey)) || [];
    setRecentProjects(storedRecentProjects);
  }, [user._id]);

  const completedProjects = projects.filter(
    (project) => project.status.toLowerCase() === "complete"
  ).length;
  const ongoingProjects = projects.length - completedProjects;

  const filteredProjects = projects.filter((project) => {
    if (filter === "complete")
      return project.status.toLowerCase() === "complete";
    if (filter === "active") return project.status.toLowerCase() === "active";
    return true;
  });

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
  };

  const sliderImages = [
    {
      src: "slide11.jpg",
      alt: "ProjectEvo - Efficient Task Management",
      caption: "Efficient Task Management",
    },
    {
      src: "slide12.jpg",
      alt: "ProjectEvo - Seamless Collaboration",
      caption: "Seamless Collaboration",
    },
    {
      src: "slide13.jpg",
      alt: "ProjectEvo - Stay Organized",
      caption: "Stay Organized",
    },
  ];

  return (
    <div>
      <Helmet>
        <title>HOME PAGE</title>
      </Helmet>
      <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg mb-6 mt-3 group">
        <div className="transition-transform transform group-hover:scale-95">
          <h2 className="text-2xl font-bold">
            Hello {user?.firstName} {user?.lastName}, Welcome to PROJECTEVO 👋
          </h2>
          <p className="mt-2">
            Manage your projects efficiently and stay on top of your tasks with
            our intuitive platform.
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center">
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            debouncedHandleSearch(e.target.value);
          }}
          className="rounded-md p-2 w-1/4"
          style={{ borderColor: "#d9d9d9", borderWidth: 1 }}
        />
      </div>

      <div className="mt-4 mb-4 text-lg text-gray-700 font-semibold">
        {projects.length} projects listed ({ongoingProjectsCount} ongoing,{" "}
        {completedProjectsCount} completed)
      </div>

      <Slider
        {...sliderSettings}
        className="mb-8 mx-auto"
        style={{ maxWidth: "99%" }}
      >
        {sliderImages.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gray-900 bg-opacity-50 p-4 rounded-b-lg">
              <Typography variant="h6" className="text-white">
                {image.caption}
              </Typography>
            </div>
          </div>
        ))}
      </Slider>

      {/* <div className="mt-5 flex items-center">
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            debouncedHandleSearch(e.target.value);
          }}
          className="rounded-md p-2 w-1/4"
          style={{ borderColor: "#d9d9d9", borderWidth: 1 }}
        />
      </div>

      <div className="mt-3 text-lg text-gray-700 font-semibold">
        {projects.length} projects listed ({ongoingProjectsCount} ongoing,{" "}
        {completedProjectsCount} completed)
      </div> */}

      <div className="flex space-x-4 mt-5">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setFilter("all")}
          disabled={filter === "all"}
        >
          All
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setFilter("active")}
          disabled={filter === "active"}
        >
          Active
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setFilter("complete")}
          disabled={filter === "complete"}
        >
          Completed
        </Button>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">
          Recent Projects ({recentProjects.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {recentProjects.length > 0 ? (
            recentProjects.map((project) => (
              <Card
                key={project._id}
                className="transition-transform transform hover:scale-105"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 230,
                  position: "relative",
                  backgroundImage: `url('inchaelah.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",

                  "&:hover": {
                    backgroundColor: "rgba(211, 224, 234, 1)", // Peace green color
                    backgroundImage: "none", // Remove background image on hover
                  },

                  "& .MuiCardActionArea-focusHighlight": {
                    backgroundColor: "transparent", // Override the default highlight color
                  },
                }}
              >
                <IconButton
                  onClick={() => removeRecentProject(project._id)}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    zIndex: 1,
                    "&:hover": {
                      backgroundColor: "rgba(255, 69, 0, 0.2)", // Slightly transparent volcano color on hover
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>

                <CardActionArea
                  onClick={() => handleProjectClick(project)}
                  sx={{ paddingTop: "10px", paddingBottom: "1px" }} // Added paddingBottom
                >
                  <CardContent>
                    <div className="flex justify-between items-center ">
                      <Typography
                        variant="h6"
                        component="div"
                        className="text-primary"
                      >
                        {project.name}
                      </Typography>
                      {/* <Avatar
                      src={
                        project.thumbnail ||
                        "3f021816-bde1-4634-80b3-52d7f762bc6b-cover-removebg.png"
                      }
                    /> */}
                    </div>
                    <AntDivider className="my-2" />
                    <div className="flex justify-between pt-5">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="font-bold"
                      >
                        Created At
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {getDateFormat(project.createdAt)}
                      </Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="font-bold"
                      >
                        Owner
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {project.owner.firstName}
                      </Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="font-bold"
                      >
                        Status
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="uppercase"
                      >
                        {project.status}
                      </Typography>
                    </div>
                  </CardContent>
                </CardActionArea>

                <CardActions>
                  <Box display="flex" justifyContent="flex-end" width="100%">
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/project/${project._id}`)}
                    >
                      View Project
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center text-center">
              <h1 className="text-gray-600 text-xl opacity-75 mb-4">
                No recent projects
              </h1>
            </div>
          )}
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">
          Projects You Own ({ownerProjects.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
          {ownerProjects.length > 0 ? (
            ownerProjects.map((project) => (
              <Card
                key={project._id}
                className="transition-transform transform hover:scale-105"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 220,
                  position: "relative",
                  backgroundImage: `url('inchaelah.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",

                  "&:hover": {
                    backgroundColor: "rgba(211, 224, 234, 0.85)", // Peace green color
                    backgroundImage: "none", // Remove background image on hover
                  },

                  "& .MuiCardActionArea-focusHighlight": {
                    backgroundColor: "transparent", // Override the default highlight color
                  },
                }}
                onClick={() => handleProjectClick(project)}
              >
                <CardActionArea>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Typography
                        variant="h6"
                        component="div"
                        className="text-primary"
                      >
                        {project.name}
                      </Typography>
                    </div>
                    <AntDivider className="my-2" />
                    <div className="flex justify-between pt-5">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="font-bold"
                      >
                        Created At
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {getDateFormat(project.createdAt)}
                      </Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="font-bold"
                      >
                        Owner
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {project.owner.firstName}
                      </Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="font-bold"
                      >
                        Status
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="uppercase"
                      >
                        {project.status}
                      </Typography>
                    </div>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Box display="flex" justifyContent="flex-end" width="100%">
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/project/${project._id}`)}
                    >
                      View Project
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center text-center">
              <h1 className="text-gray-600 text-xl opacity-75 mb-4">
                {searchQuery
                  ? "No results"
                  : "You are not the owner of any projects yet."}
              </h1>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">
          All Projects ({projects.length})
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
        {filteredProjects.length > 0
          ? filteredProjects.map((project) => (
              <Card
                key={project._id}
                className="transition-transform transform hover:scale-105"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 220,
                  position: "relative",
                  backgroundImage: `url('inchaelah.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",

                  "&:hover": {
                    backgroundColor: "rgba(211, 224, 234, 0.85)", // Peace green color
                    backgroundImage: "none", // Remove background image on hover
                  },
                  "& .MuiCardActionArea-focusHighlight": {
                    backgroundColor: "transparent", // Override the default highlight color
                  },
                }}
                onClick={() => handleProjectClick(project)}
              >
                <CardActionArea>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Typography
                        variant="h6"
                        component="div"
                        className="text-primary"
                      >
                        {project.name}
                      </Typography>
                      {/* <Avatar
                        src={
                          project.thumbnail ||
                          "3f021816-bde1-4634-80b3-52d7f762bc6b-cover-removebg.png"
                        }
                      /> */}
                    </div>
                    <AntDivider className="my-2" />
                    <div className="flex justify-between pt-5">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="font-bold"
                      >
                        Created At
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {getDateFormat(project.createdAt)}
                      </Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="font-bold"
                      >
                        Owner
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {project.owner.firstName}
                      </Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="font-bold"
                      >
                        Status
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="uppercase"
                      >
                        {project.status}
                      </Typography>
                    </div>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Box display="flex" justifyContent="flex-end" width="100%">
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/project/${project._id}`)}
                    >
                      View Project
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            ))
          : !searching && (
              <div className="col-span-full flex flex-col items-center mt-24 mb-24 text-center">
                <h1 className="text-gray-600 text-xl opacity-75 mb-4">
                  {searchQuery || filter !== "all"
                    ? "No results"
                    : "It looks like you haven't started any projects yet. Click the button below to create your first project and get started!"}
                </h1>
                {!searchQuery && filter === "all" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/profile?tab=1")}
                    endIcon={<ArrowForward />}
                    style={{
                      borderRadius: "50px",
                      padding: "10px 20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Start New Project
                  </Button>
                )}
              </div>
            )}
      </div>
    </div>
  );
}

export default Home;

// hadi tani ahssen wahed tal daba mn mora l assli ..

//  berfore lkhedma lmera tanya 3liha .. ..

//  filter active and complete projects .. ..

//  hada lhamdlah ahssen code .. ..

//  hna done lahmdlah 9bel mn had lcomment slaht fch kanfeltrer blasst may byn no result kibey dak
// creer  project button .. .. lahmdlah

// lhamdllh daba done dyal dbsah .. .. .. .. zedt space l dak ter7ib mn lfoo9 .. .. .. ..

//  lcode lasli .. ana hna bch ngad slide  .. .. ..  dooone alhamdullilah gadito .. .. ..

// .. .. .. .. .. .. .. .. ..  gadi lproblem dyal lheader dyal lcard f lhover bhad lcode:
//  .. zedo f lcards li 3andi :  "& .MuiCardActionArea-focusHighlight": {
//   backgroundColor: "transparent", // Override the default highlight color
// },

// done alhamdullilah .. .. .. . .. ..
