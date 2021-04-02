import React from "react";
//Pages component
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import User from "./pages/UserInfo";
import Settings from "./pages/Settings";
import { UserProvider } from "./Contexts/Context";
import Page404 from "./EmptyStates/404";
import PageUndefined from "./EmptyStates/500";
import LandingPage from "./pages/LandingPage";
import CompleteProfile from "./pages/CompleteProfile";
import ForgotPswd from "./pages/ForgotPswd";
import Verify from "./pages/Verify";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// eslint-disable-next-line
import PrivateRoute from "./Routing/PrivateRoute";
import PublicRoute from "./Routing/PublicRoute";
import Policy from "./components/Policy";
// import { GuardProvider, GuardedRoute } from 'react-router-guards';

const Routing = () => {
  return (
    <UserProvider>
      <Router>
        <Switch>
          {/* Public Routes */}
          <PublicRoute component={Register} path="/register" exact />
          <PublicRoute component={Login} path="/login" exact />
          <PublicRoute component={Verify} path="/verify" exact />
          <PublicRoute component={LandingPage} path="/" exact />
          <PublicRoute component={ForgotPswd} path="/newpassword" exact />
          <PublicRoute component={Policy} path="/Policy" exact />
          {/*   Private Routes */}
          <PrivateRoute component={Home} path="/home" exact />
          <PrivateRoute component={Profile} path="/profile" exact />
          <PrivateRoute component={User} path="/profile/:username" exact />
          <PrivateRoute component={Settings} path="/settings" exact />
          <PrivateRoute component={Chat} path="/chat" exact />
          <PrivateRoute component={CompleteProfile} path="/steps" exact />
          <PrivateRoute component={PageUndefined} path="/undefined" exact />
          {/* Other Routes */}
          <Route component={Page404} />

          <Page404 default />
        </Switch>
      </Router>
    </UserProvider>
  );
};

export default Routing;
