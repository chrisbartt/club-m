import Image from "next/image";
const BlockChiffre = () => {
  return (
    <div className="block-difference lg:pt-[100px] pt-[50px] bg-[#f8f8f8] relative z-20 hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="bg-white lg:w-[75%] mx-auto rounded-2xl p-6 lg:mt-[-170px]">
          <div className="grid grid-cols-12 ">
            {/* Statistique 1 */}
            <div className="col-span-6 md:col-span-3">
              <div className="card lg:p-8 p-4 border-r border-[#0000000f]  h-full relative text-center">
                <h4 className="text-2xl lg:text-3xl font-semibold text-[#091626] mb-3 relative inline-block">
                  +250
                </h4>
                <p className="text-muted-foreground lg:text-[18px] text-sm">
                  Entrepreneures accompagnées
                </p>
              </div>
            </div>
            {/* Statistique 2 */}
            <div className="col-span-6 md:col-span-3">
              <div className="card lg:p-8 p-4 border-r border-[#0000000f] h-full relative text-center">
                <h4 className="text-2xl lg:text-3xl font-semibold text-[#091626] mb-3 relative inline-block">
                  +120
                </h4>
                <p className="text-muted-foreground lg:text-[18px] text-sm">
                  Business Plans validés
                </p>
              </div>
            </div>
            {/* Statistique 3 */}
            <div className="col-span-6 md:col-span-3">
              <div className="card lg:p-8 p-4 border-r border-[#0000000f] h-full relative text-center">
                {/* Valeur dans un cercle */}

                <h4 className="text-2xl lg:text-3xl font-semibold text-[#091626] mb-3 relative inline-block">
                  87%
                </h4>
                <p className="text-muted-foreground lg:text-[18px] text-sm">
                  Taux de financement
                </p>
              </div>
            </div>
            {/* Statistique 4 */}
            <div className="col-span-6 md:col-span-3">
              <div className="card lg:p-8 p-4 h-full relative text-center">
                <h4 className="text-2xl lg:text-3xl font-semibold text-[#091626] mb-3 relative inline-block">
                  +50
                </h4>
                <p className="text-muted-foreground lg:text-[18px] text-[16px]">
                  Ateliers par an
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockChiffre;
