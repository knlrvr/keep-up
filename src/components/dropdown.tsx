import React, { useState } from 'react'
import { useClerk, useUser, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'

import {
    BsThreeDotsVertical
} from 'react-icons/bs'

const SignOutButton = () => {
    const { signOut } = useClerk();
    return (
        <button onClick={() => void signOut()} >
            Sign Out
        </button>
    )
};

const Dropdown = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();

  if (!userLoaded) return <div />;

  return (
    <>
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-start text-2xl"
      ><BsThreeDotsVertical /></button>
      {isExpanded && 
      <div className="bg-gray-200 rounded-l-xl rounded-br-lg absolute mt-4 right-0 w-36">
        <ul className="p-2 px-2 space-y-2 text-right">
          {user !== null && (
            <li className="hover:bg-gray-400 hover:text-white rounded px-2 p-1 cursor-pointer"
            >
              {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
              <Link href={`/${user?.username}`}>
                My profile
              </Link>
            </li>
          )}
          <li onClick={() => setIsExpanded(false)}
            className="hover:bg-gray-400 hover:text-white rounded px-2 p-1">
            <Link href="https://github.com/knlrvr" target="_blank"
                className="w-full">
                Learn More
            </Link>
          </li>
          {isSignedIn && (
            <li className="hover:bg-gray-400 hover:text-white rounded px-2 p-1 cursor-pointer"
            >
                <SignOutButton />
            </li>
          )}
          {!isSignedIn && (
            <li className="hover:bg-gray-400 hover:text-white rounded px-2 p-1 cursor-pointer"
            >
                <SignInButton>
                    Sign In
                </SignInButton>
            </li>
          )}
        </ul>
      </div>
    }
    </div>
    </>
  )
}

export default Dropdown;