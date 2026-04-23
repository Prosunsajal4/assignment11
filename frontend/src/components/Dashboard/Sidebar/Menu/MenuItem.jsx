import { NavLink } from "react-router-dom";

const MenuItem = ({ label, address, icon: Icon }) => {
  return (
    <NavLink
      to={address}
      end
      className={({ isActive }) =>
        `flex items-center px-4 py-3 my-2 rounded-lg transition-colors duration-200 transform ${
          {
            true: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700",
            false:
              "text-gray-600 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600",
          }[isActive]
        }`
      }
    >
      <Icon className="w-5 h-5" />

      <span className="mx-4 font-medium">{label}</span>
    </NavLink>
  );
};

export default MenuItem;
