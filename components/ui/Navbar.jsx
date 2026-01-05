"use client";

import { useState } from "react"
import { usePathname } from 'next/navigation';
import Link from "next/link"
import Image from "next/image"

export default function Navbar(){
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const nav = [
        {
            name: 'Map',
            href:'/'
        },

         {
            name: 'Record',
            href:'/record'
        },

         {
            name: 'Contact',
            href:'/contact'
        }
    ];

    return(
        <header className="shadow-sm sticky top-0 z-[2000] bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="flex justify-between h-24 items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                        <div className="w-20 h-20 rounded-md">
                            <Image
                            src="/lldalogo.png"
                            alt="LLDA Logo"
                            width={200}
                            height={200}
                            priority
                            />
                        </div>
                        <span className="font-bold text-md text-gray-800">Laguna Lake Monitoring Stations</span>
                        </Link>

                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {nav.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                            href={item.href} 
                            key={item.name}
                            className={`
                                transition-colors nav-items
                                ${isActive ? 'text-[#315E26]' : 'text-gray-700 hover:text-[#315E26]'}
                            `}
                            >
                            {item.name}
                            </Link>
                        );
                        })}
                    </nav>

                    {/* Mobile Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                        aria-label="Toggle Menu"
                        aria-expanded={open}
                        className="p-2 rounded-md focus:outline-none "
                        onClick={() => setOpen(!open)}>
                             <svg
                                className={`w-6 h-6 transition-transform ${open ? 'rotate-90' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={
                                        open
                                        ? 'M6 18L18 6M6 6l12 12'
                                        : 'M4 6h16M4 12h16M4 18h16'
                                    }
                                    />
                            </svg>
                        </button>
                    </div>
                </div>

                 {/* Mobile Nav */}
                    <nav 
                    className={`md:hidden ${open ? `max-h-screen` : `max-h-0`} overflow-hidden transition-[max-height] duration-500 bg-white`}>
                        <div className="px-4 pt-4 pb-6 space-y-3 ">
                           {nav.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link 
                                href={item.href} 
                                key={item.name}
                                onClick={() => setOpen(false)}
                                className={`block px-3 py-2 rounded-md ${isActive ? 'text-[#315E26]' : 'text-gray-700 hover:text-[#315E26]'}`}
                                >
                                     {item.name}
                                </Link>
                            );
                            })}
                        </div>
                    </nav>
            </div>
        </header>
    )
}