"use client";

import React from "react";

export default function ContentPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={` h-screen w-full flex bg-black md:flex-row flex-col `}>
        {/* <SideBarre /> */}
        <div
          id="container_view_page"
          className=" w-full  bg-gray-100 dark:bg-gray-900 overflow-y-auto overflow-x-hidden scrollable rounded-b-4xl md:rounded-b-none"
        >
          <main className="section__app w-full min-h-screen py-16 pt-5 ">
            {children}
          </main>
        </div>
        {/* <MobileNavMenu /> */}
      </div>
    </>
  );
}
