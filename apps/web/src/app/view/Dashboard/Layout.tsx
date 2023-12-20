import { useIsAuthenticated } from "react-auth-kit";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import { NavBar, SideNav } from "../../components";

const Footer = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #090909;
  border-top: 1px solid rgb(156, 163, 175);
`;
const DashboardLayout = () => {
  const isAuth = useIsAuthenticated();
  const location = useLocation();
  if (!isAuth()) {
    localStorage.clear();
    return (
      <Navigate to={"/login"} state={{ from: location.pathname }} replace />
    );
  }
  return (
    <div className="dark:bg-slate-900 w-[100%] h-screen scrollbar-hide flex bg-slate-100">
      <div>
        <SideNav />
      </div>
      <div className="flex-1 scrollbar-hide max-h-screen">
        <NavBar />
        <main className="overflow-y-scroll h-[90vh] md:p-[15px] lg:px-[50px]  bg-slate-100 dark:bg-primaryColor-900">
          <h1>{location.state}</h1>
          {/*<Breadcrumb>*/}
          {/*    <Breadcrumb.Item className='capitalize mb-4 text-sm font-semibold'>*/}
          {/*        {location.pathname}*/}
          {/*    </Breadcrumb.Item>*/}
          {/*</Breadcrumb>*/}
          <Outlet />
        </main>
        <Footer>
          <p className={"dark:text-white"}>&copy;2023 SparkX Fashion Wear </p>
        </Footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
