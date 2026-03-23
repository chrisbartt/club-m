import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const BlockStartMembre = () => {
  return (
    <div className="block-start-membre lg:py-[100px] py-[50px] lg:pb-[250px] relative z-10">
      <div className="card-img absolute w-full top-0 left-0 h-full -z-10">
        <div className="overlay absolute top-0 left-0 w-full h-full  bg-black opacity-40 z-10"></div>
        <Image
          src="/images/banner4.jpg"
          alt="devenir membre"
          fill
          className="object-cover"
        />
      </div>
      <div className="container px-4 mx-auto">
        <div className="text-center lg:max-w-2xl mx-auto lg:mb-14">
          <h2 className="text-2xl lg:text-5xl font-medium text-center text-white mb-4">
          Vous ne savez pas par où commencer ?
          </h2>
          <p className="mb-6 lg:text-[18px] text-[16px] text-white max-w-xl mx-auto">
            {
              "Nous vous aidons à identifier le module le plus adapté à votre situation. Faites un diagnostic gratuit ou rejoignez la communauté Club M pour bénéficier de tous nos outils et accompagnements."
            }
          </p>
          <div className="flex justify-center gap-4">
            <Button
              className="bg-[#a55b46] text-white h-12 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-lg"
              asChild
            >
              <Link href="/contact">Faire un diagnotic gratuit</Link>
            </Button>
            <Button
              className="text-[#091626] bg-[#ffffff] h-12 hover:bg-white/80 hover:text-[#091626] cursor-pointer transition-all duration-300 rounded-lg"
              asChild
            >
              <Link href="/devenir-membre">Devenir membre</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockStartMembre;
