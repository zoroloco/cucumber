import { Route, Routes } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import TestUsers from "../pages/TestUsers";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' exact={true} element={<Home />} />
      <Route path='/users' element={<TestUsers />} />
      <Route path='*' element={<ErrorPage type='404'/>}/>
    </Routes>
  );
};

export default AppRoutes;
