import React, { useState } from "react";
import ShortCut from "../Profile/ShortCut";
import Donutchart from "../Profile/Donutchart";
import User from "../Profile/User";
import Title from "../Title";
import PIPlist from "./PIPlist";
import { IoMdPersonAdd } from "react-icons/io";

const Profile = () => {
  const [pip, setPip] = useState();

  const handleAdd = () => {};

  return (
    <div className="px-2 py-4 bg-white rounded-lg w-full dark:bg-gray-900 lg:w-60 xl:w-80 flex flex-col gap-4 bg-">
      <div className="flex justify-between items-center ml-2">
        <Title>PIP Employees</Title>
        <button
          className="mr-2 text-gray-500 py-2 px-4 rounded-full flex items-center justify-center"
          onClick={handleAdd}
        >
          <IoMdPersonAdd className="text-2xl" />
        </button>
      </div>
      <PIPlist />
      {/* <User />
      <ShortCut />
      <Donutchart /> */}
    </div>
  );
};

export default Profile;
