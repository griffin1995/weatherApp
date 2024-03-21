import { MenuIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
// Importing custom components for Sheet UI and Button from UI library
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./ui/sheet";

// Navbar component for application navigation
const Navbar = () => {
  return (
    // Container for the navbar with horizontal space between elements
    <div className="flex justify-between">
      {/* Sheet component for handling sidebar or modal-like navigation */}
      <Sheet>
        {/* Trigger for opening the Sheet, styled with text color and pointer cursor on hover */}
        <SheetTrigger className=" text-white hover:cursor-pointer">
          {/* Menu icon to indicate navigational functionality */}
          <MenuIcon size={35} style={{ zIndex: 100}} />
        </SheetTrigger>
        {/* Content of the Sheet, specifying its appearance from the left side */}
        <SheetContent side={"left"}>
          {/* Header section of the Sheet containing the title and navigational links */}
          <SheetHeader>
            {/* Title for the Sheet's header */}
            <SheetTitle>Navigation</SheetTitle>
            {/* Description or content area within the Sheet, used here for navigation links */}
            <SheetDescription>
              {/* Link component from Next.js for client-side transitions between routes */}
              <Link href="/">

                {/* Text for the link, indicating its purpose or destination */}
                <p>Home</p>
              </Link>
              <Link href="/map">
                
                {/* Text for the link, indicating its purpose or destination */}
                <p>Map</p>
              </Link>
              <Link href="/AddCity">
                
                {/* Text for the link, indicating its purpose or destination */}
                <p>Search city</p>
              </Link>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      {/* The commented Button component might be intended for user profile or actions, suggest reviewing its usage or integration */}
      {/* <Button size={"lg"}><User className='w-[2rem]' /></Button> */}
    </div>
  );
};

export default Navbar;
