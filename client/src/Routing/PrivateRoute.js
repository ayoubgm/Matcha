import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { checkTokenAction } from "../actions/userAction";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [loading, setloading] = useState(true);
  const [logged, setlogged] = useState(true);
  useEffect(() => {
    async function fetchData() {
      const res = await checkTokenAction(localStorage.getItem("token"));
      setloading(false);
      setlogged(res);
    }
    fetchData();
  }, []);
  return (
    <Route
      {...rest}
      render={(props) =>
        loading ? (
          <Redirect to="/home" />
        ) : logged ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
