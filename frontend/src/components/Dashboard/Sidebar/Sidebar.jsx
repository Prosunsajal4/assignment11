import { useState } from "react";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
// Icons
import { GrLogout } from "react-icons/gr";
import { FcSettings } from "react-icons/fc";
import { AiOutlineBars } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";

// User Menu
import MenuItem from "./Menu/MenuItem";
import AdminMenu from "./Menu/AdminMenu";
import SellerMenu from "./Menu/SellerMenu";
import CustomerMenu from "./Menu/CustomerMenu";
import useRole from "../../../hooks/useRole";
import LoadingSpinner from "../../Shared/LoadingSpinner";

const Sidebar = () => {
  const { logOut } = useAuth();
  const [isActive, setActive] = useState(false);
  const [role, isRoleLoading] = useRole();

  // Sidebar Responsive Handler
  const handleToggle = () => {
    setActive(!isActive);
  };

  if (isRoleLoading) return <LoadingSpinner />;

  return (
    <>
      {/* Small Screen Navbar, only visible till md breakpoint */}
      <div className="bg-gray-100 text-gray-800 flex justify-between md:hidden">
        <div>
          <div className="block cursor-pointer p-4 font-bold">
            <Link to="/">
              <span className="text-xl font-bold text-lime-700">
                BookCourier
              </span>
            </Link>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className="mobile-menu-button p-4 focus:outline-none focus:bg-gray-200"
        >
          <AiOutlineBars className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`z-10 md:fixed flex flex-col justify-between overflow-x-hidden bg-gray-100 w-64 space-y-6 px-2 py-4 absolute inset-y-0 left-0 transform ${
          isActive && "-translate-x-full"
        }  md:translate-x-0  transition duration-200 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Top Content */}
          <div>
            {/* Logo */}
            <div className="w-full hidden md:flex px-4 py-2 shadow-lg rounded-lg justify-center items-center bg-lime-100 mx-auto">
              <Link to="/">
                <span className="text-2xl font-bold text-lime-700">
                  BookCourier
                </span>
              </Link>
            </div>
            {/* Role Indicator */}
            <div className="mt-4 text-center">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                Role: {role ? role : "Loading..."}
              </span>
            </div>
          </div>

          {/* Middle Content */}
          <div className="flex flex-col justify-between flex-1 mt-6">
            {/*  Menu Items */}
            <nav>
              {/* Common Menu */}
              <MenuItem
                icon={BsGraphUp}
                label="Statistics"
                address="/dashboard"
              />
              {/* Show only the correct menu for each role */}
              {role === "admin" && <AdminMenu />}
              {role === "seller" && <SellerMenu />}
              {role === "customer" && <CustomerMenu />}
            </nav>
          </div>

          {/* Bottom Content */}
          <div>
            <hr />

            <MenuItem
              icon={FcSettings}
              label="Profile"
              address="/dashboard/profile"
            />
            <button
              onClick={logOut}
              className="flex cursor-pointer w-full items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-300   hover:text-gray-700 transition-colors duration-300 transform"
            >
              <GrLogout className="w-5 h-5" />

              <span className="mx-4 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
