import { Spin } from "antd";
import { Link } from "react-router-dom";
import "./404.css";
const NotFound = () => {
  return (
    <div className="bg-black h-screen text-gray-400 flex justify-center flex-col items-center space-y-8  text-2xl relative px-6 py-2 md:py-1 md:px-4 ">
      <h3 className=" text-4xl">
        Features Under Maintenance <Spin />
      </h3>
      <Link className=" border text-gray-400 w-fit px-2" to={"/dashboard"}>
        Go To Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
