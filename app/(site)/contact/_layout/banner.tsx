import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="banner relative z-10">
      <div className="overlay absolute top-0 left-0 w-full h-full -z-10 bg-black opacity-50"></div>
      <div className="content-img absolute top-0 left-0 w-full h-full -z-20">
        <Image
          src="/images/img-contact.jpg"
          alt="devenir membre"
          width={100}
          height={100}
          layout="responsive"
          className="w-[100%!important] h-[100%!important] object-cover"
        />
      </div>
      <div className="content-banner min-h-[90vh] lg:min-h-[75vh] flex flex-col justify-center items-center py-14 lg:py-[100px]">
        <div className="container mt-auto px-4">
          <div className="grid grid-cols-12 lg:gap-10 items-end">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="text-4xl lg:text-[64px] font-medium text-white mb-3 tracking-[-0.02em]">
              Parlons de ton projet.

              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
