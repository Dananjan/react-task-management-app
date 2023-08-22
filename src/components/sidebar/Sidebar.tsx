//Sidebar.tsx
import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem, SidebarHeader,SidebarFooter, SidebarContent } from "react-pro-sidebar";
import { BiShieldQuarter } from "react-icons/bi";
import { FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { AiOutlineDashboard, AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import "react-pro-sidebar/dist/css/styles.css";
import "./Sidebar.css";


const Sidebar: React.FC = () => {
  
    const [menuCollapse, setMenuCollapse] = useState(true)
    const [activeItem, setActiveItem] = useState('');

  const menuIconClick = () => {
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };

  const handleItemClick = (itemName: React.SetStateAction<string>) => {
    setActiveItem(itemName);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
      alert('Failed to logout. Please try again.');
    }
  };


  return (
    <>
      <div id="header">
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>
            <div className="closemenu" onClick={menuIconClick}>
              {menuCollapse ? (
                <FiArrowRightCircle/>
              ) : (
                <FiArrowLeftCircle/>
              )}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              <div className={activeItem === 'Dashboard' ? 'sidebar-item active' : 'sidebar-item'} onClick={() => handleItemClick('Dashboard')}>
                <MenuItem icon={<AiOutlineDashboard />}>
                  <Link to='/dashboard'>Dashboard</Link>
                </MenuItem>
              </div>
              <div className={activeItem === 'UpdateProfile' ? 'sidebar-item active' : 'sidebar-item'} onClick={() => handleItemClick('UpdateProfile')}>
                <MenuItem icon={<AiOutlineUser/>}>
                  <Link to='/updateprofile'>Profile update</Link>
                </MenuItem>
              </div>
              <div className={activeItem === 'PasswordReset' ? 'sidebar-item active' : 'sidebar-item'} onClick={() => handleItemClick('PasswordReset')}>
                <MenuItem icon={<BiShieldQuarter />}>
                  <Link to='/passwordreset'>Password Reset</Link>
                </MenuItem>
              </div>
            </Menu>
          </SidebarContent>
          <SidebarFooter>
            <div onClick={handleLogout}>
              <Menu iconShape="square">
                <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
              </Menu>
            </div>
          </SidebarFooter>
        </ProSidebar>
      </div>
    </>
  );
};

export default Sidebar;