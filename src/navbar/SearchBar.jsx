import React from "react";
import { IoSearch } from "react-icons/io5";
import { useGlobleContext } from "../globle/context";

const SearchBar = () => {
    const {vehicleno, setVehicleno} = useGlobleContext();

    const handleChange = (e) => {
        setVehicleno(e.target.value);
      }; 

  return (
    <div className="relative flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
      <input
        type="text"
        value={vehicleno}
        onChange={handleChange}
        placeholder="Search vehicle by number..."
        className="outline-none w-56 text-sm text-gray-700 placeholder-gray-400 bg-transparent"
      />
      <button className="ml-2 text-blue-600 hover:text-blue-800 transition">
        <IoSearch size={22} />
      </button>
    </div>
  );
};

export default SearchBar;
