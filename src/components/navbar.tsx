import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BsLock } from 'react-icons/bs'
import { SignInButton, useUser } from '@clerk/nextjs'

import Dropdown from './dropdown'

const Navbar = () => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();

  if (!userLoaded) return <div />;

  return (
    <div className="fixed top-2 inset-x-0 bg-white bg-opacity-95 max-w-xl mx-auto border-x border-b border-gray-200 z-50">
        <div className="flex justify-between pt-4 py-8 items-center">
            <div className="text-xl font-semibold p-2 px-4">
                <span className="font-thin">KeepUp </span>
                · Home
            </div>
            <div className="px-2 flex items-center">
              {!isSignedIn && ( 
                <div className="mr-4 text-sm bg-blue-400 text-white px-4 py-1 rounded-full hover:bg-blue-300 transition duration-300">
                  <SignInButton> 
                      Sign In 
                  </SignInButton>
                </div>
              )}
              {user !== null && (
              <div>
                <Link href={`/${user.username}`}>
                  <Image src={user.profileImageUrl} alt={`${user.username}'s profile picture`}
                    width="1000" height="0"
                    className="w-7 h-7 rounded-full mr-4"
                  />
                </Link>
              </div> 
              )}
              <Dropdown />
            </div>
        </div>
        <div className="p-2 flex justify-evenly items-start cursor-default">
          <div className="flex flex-col group transition duration-300">
            <span className="">Feed</span>
            <span className="h-1 w-9 bg-blue-400 rounded-full"></span>
          </div>
          <div className="flex items-center cursor-pointer">
            <span className="hover:text-gray-500">Following</span>
            <BsLock className="ml-1"/>
          </div>
          <div className="flex items-center cursor-pointer">
            <span className="hover:text-gray-500">Trending</span>
            <BsLock className="ml-1"/>
          </div>
        </div>
    </div>
  )
}

export default Navbar;