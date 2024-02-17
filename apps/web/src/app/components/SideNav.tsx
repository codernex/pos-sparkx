import { motion } from "framer-motion";
import { SiShopware } from "react-icons/si";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import { useSettingContext } from "../context/SettingProver";

import navigation from "./navigation";
import { useState } from "react";
import {
  HiChevronDown,
  HiChevronLeft,
  HiChevronRight,
  HiChevronUp,
} from "react-icons/hi";
import classNames from "classnames";

const CustomLink = styled(NavLink)`
  display: flex;
  align-items: center;
  column-gap: 16px;
  padding: 3px 0px 2.5px 4px;
  border-radius: 5px;
  font-size: 16px;
  margin: 12px;
  letter-spacing: 1px;

  &:hover {
    color: #0f172a;
    background: #ededed;
  }
`;

const SimpleLink = styled(Link)`
  color: #fff;
  font-weight: bold;
  display: flex;
  column-gap: 12px;
  align-items: center;
`;

const SideBar = styled(motion.div)`
  height: 100vh;
  overflow: auto;
  padding-bottom: 35px;
  --webik-scrollbar: {
    display: none;
  };
  border-radius: 20px;
  scroll-behavior: smooth;
  border-right: 1px solid rgb(156, 163, 175);
  @media (max-width: 1400px) {
    overflow: hidden;
    &:hover {
      overflow: auto;
    }
  }
`;

const SideNav = () => {
    const {isActive, setActive, currentUser} = useSettingContext();
    const [isSubmenuOpen, setSubmenuOpen] = useState<number | null>(null);
    const [toggleSidebar, setToggleSidebar] = useState<boolean>(false);
    const sidebarClass = classNames('scrollbar-hide bg-primary-color duration-300 relative z-20 overflow-x-hidden h-screen dark:bg-primaryColor-900', {
        'w-72': isActive,
        'w-20': !isActive
    })


    return (
        <SideBar
            className={sidebarClass}
            onMouseEnter={() => setToggleSidebar(true)} onMouseLeave={() => setToggleSidebar(false)}>

            {
                toggleSidebar ? <div
                    onClick={() => setActive(!isActive)}
                    className={' absolute cursor-pointer duration-200 text-xl top-9 right-0 bg-light-white z-40 w-[40px] h-[40px] flex items-center justify-center text-white'}>
                    {
                        isActive ? <HiChevronLeft/> : <HiChevronRight/>
                    }
                </div> : null
            }

            <div className={`${isActive ? 'ml-6 ' : 'flex flex-col items-center'}`}>
                <div

                    className='flex justify-between items-center m-3 mt-4'
                >
                    <SimpleLink to={'/dashboard'}>
                        <SiShopware color={'#fff'} fontSize={'40px'}/> {
                        isActive && <span className={'text-white'}>POS SparkX</span>
                    }
                    </SimpleLink>
                </div>

                <ul className='mt-10'>
                    {/* eslint-disable-next-line array-callback-return */}
                    {navigation.map((item, i) => {
                        if (currentUser && item.access.includes(currentUser.role)) {
                            return (
                                <li key={i} className='m-3 mt-4 text-light-white uppercase flex flex-col font-bold'>
                                    <div className={'flex gap-x-5 items-center'}>
                                        <span onClick={() => setActive(true)} className={'text-2xl cursor-pointer'}><item.Icon/></span>
                                        {
                                            isActive ?
                                                <p className={`flex gap-x-5 items-center cursor-pointer`}
                                                   onClick={() => {
                                                       if (isSubmenuOpen === i) {
                                                           setSubmenuOpen(null)
                                                       } else {
                                                           setSubmenuOpen(i)
                                                       }
                                                   }}>
                                                    <span>{item.title} </span>
                                                    <span>{isSubmenuOpen === i ?
                                                        <HiChevronUp cursor={'pointer'}
                                                                     onClick={() => setSubmenuOpen(null)}/> :
                                                        <HiChevronDown cursor={'pointer'}
                                                                       onClick={() => setSubmenuOpen(i)}/>}</span>
                                                </p> : null
                                        }
                                    </div>
                                    {
                                        isActive ? <ul>
                                            {isSubmenuOpen === i && item.links.map((link, i) => {
                                                if (currentUser && link.access.includes(currentUser.role)) {
                                                    return <li key={i}><CustomLink to={link.to}
                                                                                   className='font-semibold text-white duration-200 '>
                                                        {/*<link.Icon/>*/}
                                                        <span className='capitalize ml-8'>{link.text}</span>
                                                    </CustomLink></li>
                                                }
                                                return null;
                                            })}
                                        </ul> : null
                                    }

                                </li>
                            )
                        }
                    })}
                </ul>
            </div>

        </SideBar>
    );
};

export default SideNav;
