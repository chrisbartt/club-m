
const BlockAccompagn = () => {
  return (
    <div className="block-intro lg:py-[100px]  bg-[#f8f8f8] py-[50px]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 hidden md:block"></div>
          <div className="col-span-12 lg:col-span-10">
            <div className="text-center lg:max-w-3xl mx-auto ">
              <h3 className="text-sm lg:text-base uppercase font-semibold text-[#a55b46] mb-3 relative inline-block pb-3">
              Le problème ressenti
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
              </h3>
              <h2 className="text-2xl lg:text-[48px] leading-[1.2] font-semibold text-center text-[#091626] tracking-[-0.02em]">
              Tu sais que tu peux. Mais tu tournes en rond. 
              </h2>
            </div>
            
          </div>
          <div className="col-span-1 hidden md:block"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockAccompagn;
