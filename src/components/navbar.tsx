import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BsBoxArrowLeft, BsLock } from 'react-icons/bs'
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'

import Dropdown from './dropdown'

const Navbar = () => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();

  if (!userLoaded) return <div />;

  return (
    <div className="fixed top-0 inset-x-0 bg-opacity-95 backdrop-filter backdrop-blur-md max-w-4xl mx-auto border-x border-b border-gray-200 z-50">
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

              {isSignedIn && (
              <div className="mr-4 text-sm px-4 py-1 rounded-full  transition duration-300 border border-[#222]">
                <SignOutButton> 
                  Sign Out                  
                </SignOutButton>
              </div>
              )}
              {user && (
              <div>
                {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
                <Link href={`/${user?.username || null}`}>
                  {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
                  <Image src={user?.profileImageUrl} alt={`${user.username || null}'s profile picture`}
                    width="1000" height="0"
                    className="w-7 h-7 rounded-full mr-4"
                  />
                </Link>
              </div> 
              )}
              {/* <Dropdown /> */}
            </div>
        </div>
        <div className="p-2 flex justify-evenly items-start cursor-default mb-1">
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