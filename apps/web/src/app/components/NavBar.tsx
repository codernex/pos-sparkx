import { Dropdown, Input, MenuProps, Space } from "antd";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { useSettingContext } from "../context/SettingProver";
import CurrentUser from "./CurrentUser";
import { Link } from "react-router-dom";
import { FaCashRegister, FaUser } from "react-icons/fa";
import { MdOutlineDarkMode } from "react-icons/md";
import classNames from "classnames";
import { UserRole } from "../../types";

const NavBar = () => {
  const { profile, setProfile, mode, setMode, currentUser } =
    useSettingContext();
  const modeSwitch = classNames("rounded-md", {
    "bg-primaryColor-900 text-white": mode === "light",
    "bg-white text-primaryColor-900": mode === "dark",
  });

  const [searchTerm, setSearchTerm] = useState<string | null | undefined>(
    "Wanna Try?"
  );

  const items: MenuProps["items"] = [
    {
      label: "For Invoice",
      key: "1",
    },
    {
      label: "For Product",
      key: "2",
    },
    {
      label: "For Employee",
      key: "3",
    },
    {
      label: "For Cost",
      key: "4",
    },
    {
      label: "For Supply",
      key: "5",
    },
    {
      label: "For Customer",
      key: "6",
    },
  ];
  const onClick: MenuProps["onClick"] = ({ key }) => {
    const item = items.find((item) => item?.key === key) as {
      label: string;
      key: string;
    };
    setSearchTerm(item!.label);
  };

  return (
    <nav
      className={`flex h-[48px] justify-between items-center md:p-[15px] lg:mx-[50px] text-dark-purple text-xl bg-white shadow-md rounded-md dark:bg-slate-900 dark:text-white`}
    >
      <div className="flex">
        <Dropdown
          className="cursor-pointer text-right dark:text-white"
          menu={{ items, onClick }}
        >
          <button onClick={(e) => e.preventDefault()}>
            <Space className="w-[120px]">
              <p className={"text-primaryColor-900 dark:text-white text-14"}>
                {searchTerm}
              </p>
              <AiOutlineDown />
            </Space>
          </button>
        </Dropdown>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Features Under Maintenance");
          }}
        >
          <Input
            className="w-[250px] dark:bg-slate-700 dark:text-white dark:border-none dark:placeholder:text-white"
            type={"text"}
            placeholder="Search"
          />
        </form>
      </div>

      <div className="flex gap-x-14">
        <button>
          {mode === "light" ? (
            <MdOutlineDarkMode
              className={"text-white bg-primaryColor-900 rounded-md"}
              onClick={() => setMode("dark")}
              fontSize={30}
            />
          ) : (
            <MdOutlineDarkMode
              className={" rounded-md"}
              onClick={() => setMode("light")}
              fontSize={30}
            />
          )}
        </button>

        {!currentUser?.role.includes(UserRole[1]) && (
          <Link
            to={"pos"}
            className="text-primaryColor-900 hover:text-primary-color dark:text-white"
          >
            <FaCashRegister fontSize={30} />
          </Link>
        )}

        <div
          className="relative text-primaryColor-900"
          onMouseLeave={() => setProfile(false)}
          onMouseEnter={() => setProfile(true)}
        >
          <span className="text-primaryColor-900 hover:text-primary-color dark:text-white">
            <FaUser fontSize={30} cursor="pointer" />
          </span>
          <AnimatePresence>{profile ? <CurrentUser /> : null}</AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
