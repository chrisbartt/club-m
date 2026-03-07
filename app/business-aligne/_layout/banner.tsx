import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="banner relative z-10">
      <div className="overlay absolute top-0 left-0 w-full h-full -z-10 bg-black opacity-40"></div>
      <div className="content-img absolute top-0 left-0 w-full h-full -z-20">
        <Image src="/images/banner10.jpg" alt="devenir membre" width={100} height={100} layout="responsive" className="w-[100%!important] h-[100%!important] object-cover" />
      </div>
      <div className="content-banner min-h-[90vh] lg:min-h-[95vh] flex flex-col justify-center items-center py-14 lg:py-[100px]">
        <div className="container mt-auto px-4">
          <div className="grid grid-cols-12 lg:gap-10 items-end">
            <div className="col-span-12 lg:col-span-7">
              <h1 className="text-4xl lg:text-[72px] font-medium text-white mb-3">
              Ton idée mérite un plan. Et ton plan mérite d&apos;être imbattable. 
              </h1>
              <p className="text-white lg:text-xl mb-6 lg:mb-6 max-w-xl ">
              Business Aligné, le parcours de la femme entrepreneuse en République Démocratique du Congo.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="bg-[#a55b46] text-white h-14 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl"
                  asChild
                >
                  <Link href="/business-aligne/commencer">
                    Réserver ma session
                  </Link>
                </Button>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
