import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const CPrivateRoute = ({ component: Component, path, ...rest }) => {
  const state = useSelector(state => state.auth);
  return (
    <Routes>
    <Route
      path={path}
      {...rest}
      element={
        state.isLoading ? (
          <h3>Loading....</h3>
        ) : state.isAuthenticated && state.isCostumer ? (
          <Component {...rest} />
        ) : (
          <Navigate to="/login" />
        )
      }
    />
    </Routes>
  );
};

export const FPrivateRoute = ({ component: Component, path, ...rest }) => {
  const state = useSelector(state => state.auth);
  return (
    <Routes>
    <Route
      path={path}
      {...rest}
      element={
        state.isLoading ? (
          <h3>Loading....</h3>
        ) : state.isAuthenticated && !state.isCostumer ? (
          <Component {...rest} />
        ) : (
          <Navigate to="/login" />
        )
      }
    />
    </Routes>
  );
};
