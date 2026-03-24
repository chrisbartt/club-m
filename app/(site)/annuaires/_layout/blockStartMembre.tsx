import { Button } from "@/components/ui/button";
import Link from "next/link";

const BlockStartMembre = () => {
  return (
    <div className="block-start-membre lg:py-[100px] py-[50px] relative z-10 bg-[#581621]">
      <div
        className="absolute inset-0 pointer-events-none opacity-20 -z-10"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="container px-4 mx-auto">
        <div className="text-center lg:max-w-3xl mx-auto">
          <h2 className="text-2xl lg:text-[44px] leading-[1.2] tracking-[-0.02em] font-semibold text-center text-white mb-4">
          Une communauté entrepreneuriale active, 88 membres entrepreneures
+20 secteurs d’activités représentés.

          </h2>
          <p className="mb-6 lg:text-[18px] text-[16px] text-white max-w-xl mx-auto">
          Chaque membre contribue à créer un environnement où l’entraide, le partage et les opportunités business sont encouragés.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            className="bg-[#a55b46] text-white h-14 px-5  hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl  gap-2"
            asChild
          >
            <Link href="/devenir-membre#pricing">
            {"Rejoindre le club"}
            </Link>
          </Button>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockStartMembre;