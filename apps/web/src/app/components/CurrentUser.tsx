import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { AuthStateUserObject } from "react-auth-kit/dist/types";
import api from "../../api";
import { useSettingContext } from "../context/SettingProver";
import { FcEngineering, FcPortraitMode } from "react-icons/fc";
import { FiLogOut } from "react-icons/fi";

const CurrentUser = () => {
  const userData = useAuthUser();
  const [user, setUser] = useState<IUser | AuthStateUserObject | null>(null);
  const logout = useSignOut();
  const { setProfile } = useSettingContext();
  const signOut = async () => {
    api.post("/auth/logout").then(() => {
      logout();
      localStorage.clear();
      setProfile(false);
    });
  };

  useEffect(() => {
    const loggedUser = userData();
    setUser(loggedUser);
  }, [userData]);
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.5,
        y: "-300px",
      }}
      animate={{
        y: "0px",
        opacity: 1,
        scale: 1,
      }}
      exit={{
        y: "-300px",
        opacity: 0,
        transition: { duration: 0.7 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="border w-[350px] h-[200px] absolute left-[-300px] bg-white p-4 bottom-[-214px] rounded-md flex flex-col gap-y-3 items-start z-50 dark:bg-slate-700 dark:border-none dark:text-white"
    >
      <div className={"flex gap-x-2 items-center"}>
        <FcPortraitMode />
        <p className="font-bold text-primaryColor-900 dark:text-white">
          {user?.username}
        </p>
      </div>
      <div className={"flex gap-x-2 items-center"}>
        <FcEngineering />
        <p className="font-bold text-primaryColor-900 dark:text-white">
          {user?.role}
        </p>
      </div>

      <button
        onClick={signOut}
        className="
        btn__common
      "
      >
        <FiLogOut />
        Logout
      </button>
    </motion.div>
  );
};

export default CurrentUser;
