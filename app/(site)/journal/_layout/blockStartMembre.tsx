import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const BlockStartMembre = () => {
  return (
    <div className="block-start-membre lg:py-[100px] py-[50px] relative z-10">
      <div className="card-img absolute w-full top-0 left-0 h-full -z-10">
        <div className="overlay absolute top-0 left-0 w-full h-full bg-black opacity-40 z-10"></div>
        <Image
          src="/images/banner4.jpg"
          alt="Business Aligné"
          fill
          className="object-cover"
        />
      </div>
      <div className="container px-4 mx-auto">
        <div className="text-center lg:max-w-2xl mx-auto">
          <h2 className="text-2xl lg:text-[48px] leading-[1.2] tracking-[-0.02em] font-semibold text-center text-white mb-4">
            Rejoindre le Club M, c’est accéder :
          </h2>
          <ul className="flex flex-wrap gap-3 justify-center mb-6">
            <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#ffffff] rounded-full">
              <div className="icon flex items-center justify-center w-6 h-6 bg-[#e7a795] rounded-full flex-shrink-0">
                <Check className="w-4 h-4 text-[#151516]" />
              </div>
              Les bonnes méthodes
            </li>
            <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#ffffff] rounded-full">
              <div className="icon flex items-center justify-center w-6 h-6 bg-[#e7a795] rounded-full flex-shrink-0">
                <Check className="w-4 h-4 text-[#151516]" />
              </div>
              Les bonnes connexions
            </li>
            <li className="flex gap-2 items-center text-[#151516] text-base leading-relaxed py-2 px-2 bg-[#ffffff] rounded-full">
              <div className="icon flex items-center justify-center w-6 h-6 bg-[#e7a795] rounded-full flex-shrink-0">
                <Check className="w-4 h-4 text-[#151516]" />
              </div>
              Le bon environnement
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="bg-[#a55b46] text-white h-14 px-5  hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl  gap-2"
              asChild
            >
              <Link href="/devenir-membre#pricing">
                {"Rejoins Le Club M dès aujourd’hui."}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockStartMembre;
