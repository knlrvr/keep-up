import React from 'react'
import { BsLock } from 'react-icons/bs'

import Dropdown from './dropdown'

const Navbar = () => {
  return (
    <div className="max-w-xl mx-auto border-x border-b border-gray-200">
        <div className="flex justify-between pt-4 py-8 items-center">
            <div className="text-xl font-semibold p-2 px-4">
                Home
            </div>
            <div className="px-2">
                <Dropdown />
            </div>
        </div>
        <div className="p-2 flex justify-evenly items-start cursor-pointer">
          <div className="flex flex-col group transition duration-300">
            <span className="group-hover:text-gray-500">Feed</span>
            <span className="h-1 w-9 bg-blue-400 rounded-full group-hover:bg-blue-200 transition duration-300"></span>
          </div>
          <div className="flex items-center">
            <span className="hover:text-gray-500">Following</span>
            <BsLock className="ml-1"/>
          </div>
          <div className="flex items-center">
            <span className="hover:text-gray-500">Trending</span>
            <BsLock className="ml-1"/>
          </div>
          <div className="flex items-center">
            <span className="hover:text-gray-500">For You</span>
            <BsLock className="ml-1"/>
          </div>
        </div>
    </div>
  )
}

export default Navbar;