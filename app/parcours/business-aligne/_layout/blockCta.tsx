import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BlockCta = () => {
  return (
    <div className="block-start-membre lg:py-[100px] py-[50px] lg:pb-[250px] relative z-10">
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
          <h2 className="text-2xl lg:text-5xl font-medium text-center text-white mb-4">
            Prête à clarifier ton idée ?
          </h2>
          <p className="mb-6 lg:text-[18px] text-[16px] text-white max-w-xl mx-auto">
            Rejoins les 150+ femmes qui ont transformé leur vision en projet concret grâce au Business Aligné du Club M.
          </p>
          <Button
            className="bg-[#a55b46] text-white h-12 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-lg  gap-2 mx-auto"
            asChild
          >
            <Link href="/parcours/business-aligne/commencer">
              Commencer maintenant <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlockCta;
