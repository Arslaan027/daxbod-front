// import React, { useState } from "react";
// import ShortCut from "../Profile/ShortCut";
// import Donutchart from "../Profile/Donutchart";
// import User from "../Profile/User";
// import Title from "../Title";
import PIPlist from "./PIPlist";
// import { IoMdPersonAdd } from "react-icons/io";

const Profile = () => {
  return (
    <div className="px-2 py-4 bg-white rounded-lg w-full dark:bg-gray-900 lg:w-60 xl:w-80 flex flex-col gap-4">
      <PIPlist />
      {/* <User />
      <ShortCut />
      <Donutchart /> */}
    </div>
  );
};

export default Profile;
