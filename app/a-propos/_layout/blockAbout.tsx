
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const BlockAbout = () => {
  return (
    <div className="block-intro lg:py-[100px] py-[50px] bg-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 lg:col-span-6">
            <div className="card-img w-full relative mx-auto lg:w-[80%] md:min-h-[570px] min-h-[350px] h-full z-10">
              <div className="absolute left-[-5%] w-[80%] h-[110%] bg-[#f8f8f8] -z-10 top-1/2 -translate-y-1/2 rounded-2xl"></div>
              <div className="md:min-h-[500px] min-h-[350px] h-full relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/maurelle.jpeg"
                  alt="devenir membre"
                  fill
                  className="object-cover"
                />
              </div>
              
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="lg:pr-26 flex flex-col justify-center h-full">
              <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-3 relative inline-block pb-3">
                Fondatrice et visioinnaire
                <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#a55b46]"></span>
              </h3>
              <h4 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold text-[#091626] mb-2 lg:mb-4 tracking-[-0.02em]">
                Maurelle Kitebi
              </h4>
              <div>
                <p className="text-muted-foreground md:mb-6 lg:text-[18px] text-[16px]">
                  Entrepreneure passionnée et visionnaire, Maurelle a fondé Club
                  M avec la conviction profonde que les femmes congolaises
                  possèdent un potentiel immense qui ne demande qu&apos;à être
                  révélé. Forte de plus de 10 ans d&apos;expérience dans
                  l&apos;accompagnement entrepreneurial, elle a guidé des
                  centaines de femmes sur leur chemin vers le succès.
                </p>

                <div className="card border border-dashed p-3 rounded-xl mt-2 flex md:gap-4 gap-3">
                  
                  <div>
                    
                    <p className="text-sm lg:text-[18px] text-[#091626]">
                      « Je crois en la force collective des femmes. Ensemble, nous pouvons transformer nos défis en opportunités et bâtir un écosystème où chaque entrepreneure a les moyens de réussir.»
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <Button
                    className="bg-[#a55b46] text-white h-14 px-5 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl"
                    asChild
                  >
                    <Link href="/devenir-membre/">
                      Rejoindre le Club
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockAbout;
