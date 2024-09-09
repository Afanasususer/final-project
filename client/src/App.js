import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedPage from "./components/ProtectedPage";
import Spinner from "./components/Spinner";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProjectInfo from "./pages/ProjectInfo";
import Register from "./pages/Register";
import Verified from "./pages/Verified";
import Singin from "./pages/fakeLogin";
import CoverPage from "./pages/Cover/CoverPage";
// aboutpage
import AboutWork from "./pages/about/about";
import AboutUs from "./pages/about/aboutUs";
import Contact from "./pages/contact/contact";
//

// forgot password
import ForgotPassword from "./pages/forgotPassword/forgotPassword";
import ResetPassword from "./pages/newPassword/newPassord";
//

// profile test : dertha bch nester fiha design li ghaykon 3andi f lprofil
import ProfilePage from "./pages/test_profile/test_profile";
//

// not found page
import NotFound from "./pages/error/notfound";
//

// delete account
import DeleteAccount from "./pages/deleteAccount/deleteAccount";
//
// activate account
import AccountActivate from "./pages/accountActivate/accountActivate";
import ConfirmActivate from "./pages/confirmActivate/confirmActivate";
//

// internChangePassword
import InternChangePassword from "./pages/interChangePassword/interChangePassword";
import ProtectedForgotPassword from "./pages/forgotPassword/ProtectedForgotPassword";
//



function App() {
  const { loading } = useSelector((state) => state.loaders);

  return (
    <div>
      {loading && <Spinner />}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedPage>
                <Home />
              </ProtectedPage>
            }
          />
          <Route
            path="/project/:id"
            element={
              <ProtectedPage>
                <ProjectInfo />
              </ProtectedPage>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedPage>
                <Profile />
              </ProtectedPage>
            }
          />
          <Route
            path="/AboutUs"
            element={
              <ProtectedPage>
                <AboutUs />
              </ProtectedPage>
            }
          />
          {/* hada houa li zedt dyal delete account */}
          <Route
            path="/deleteAccount"
            element={
              <ProtectedPage>
                <DeleteAccount />
              </ProtectedPage>
            }
          />
          {/* ******************** chnage psssword in profile red lbal khassha tkon protcted  */}
          <Route
            path="/internChangePassword"
            element={
              <ProtectedPage>
                <InternChangePassword />
              </ProtectedPage>
            }
          />
          <Route
            path="/protectedForgotPassword"
            element={
              <ProtectedPage>
                <ProtectedForgotPassword />
              </ProtectedPage>
            }
          />
          {/* ***********************************************schedule tasks********************/}

            

          {/* ************************************ */}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verified" element={<Verified />} />
          <Route path="/login/new" element={<Singin />} />
          <Route path="/coverpage" element={<CoverPage />} />
          <Route path="/about" element={<AboutWork />} />
          <Route path="/contact" element={<Contact />} />
          {/* *********************** */}
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          {/* *********************** */}

          {/* *********************** test profile*/}
          <Route path="/profilePage" element={<ProfilePage />} />
          {/* *********************** */}

          {/* *********************** AccountActivate*/}
          <Route path="/accountActivate" element={<AccountActivate />} />
          <Route path="/confirmActivate" element={<ConfirmActivate />} />
          {/* *********************** */}

          {/* notFfound route should be always the last route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
// show schedule task is done الحمدلله donc had hna kolchi lhamdla 5edam mezyan blasst ma knt kan5azen tasks 
// scheduales ghy f array weli kan5azenhoom f database haka kandmn bli maghadich ydi3o w ghaybqaw dima kay-
// nin hta lhad lcomment hada lhamdlah kolchi fine kan9der nafficher schedualed tasks without any problem
