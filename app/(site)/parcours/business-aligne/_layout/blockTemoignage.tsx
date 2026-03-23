import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const BlockTemoignage = () => {
  const testimonials = [
    {
      initials: "AM",
      name: "Amina Mutombo",
      title: "Fondatrice, BeautyHub RDC",
      quote: "Le Business Aligné m'a permis de voir que mon idée avait du potentiel mais nécessitait quelques ajustements. J'ai gagné un temps fou!",
      rating: 5,
    },
    {
      initials: "GK",
      name: "Grace Kabamba",
      title: "Créatrice, Textile Moderne",
      quote: "J'avais peur de me lancer. Le Business Aligné m'a donné la confiance nécessaire et une feuille de route claire pour avancer.",
      rating: 5,
    },
    {
      initials: "FM",
      name: "Farah Mbuyi",
      title: "Fondatrice, Agro-Connect",
      quote: "L'équipe a été honnête: mon idée n'était pas viable telle quelle. Grâce à leurs conseils, j'ai pivoté et aujourd'hui ça marche !",
      rating: 5,
    },
  ];

  return (
    <div className="block-intro lg:py-[100px] py-[50px] bg-[#ffffff]">
      <div className="container px-4 mx-auto">
        <div className="text-center lg:max-w-2xl mx-auto lg:mb-14">
          <h3 className="text-sm lg:text-base uppercase font-medium text-[#a55b46] mb-3 relative inline-block pb-3">
            TÉMOIGNAGES
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[3px] bg-[#a55b46]"></span>
          </h3>
          <h2 className="text-2xl lg:text-4xl font-medium text-center text-[#091626] mb-4">
            Elles ont clarifié leur idée avec nous
          </h2>
        </div>

        <div className="grid grid-cols-12 lg:gap-6 gap-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="col-span-12 lg:col-span-4">
              <div className="card lg:p-8 p-4 rounded-2xl bg-[#f8f8f8] h-full relative z-10 border border-[#0000000f]">
                <div className="icon absolute top-3 right-3 -z-10">
                  <Quote className="w-12 h-12 text-[#0000000e]" />
                </div>

                {/* Note */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>

                {/* Citation */}
                <p className="text-muted-foreground lg:text-[16px] text-[14px] mb-6 italic">
                  &quot;{testimonial.quote}&quot;
                </p>

                {/* Avatar et infos */}
                <div className="flex gap-3 items-center">
                  <Avatar className="lg:w-12 lg:h-12 w-10 h-10 bg-[#a55b46]">
                    <AvatarFallback className="text-white font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-lg lg:text-xl font-medium text-[#091626]">
                      {testimonial.name}
                    </h4>
                    <p className="text-muted-foreground lg:text-[14px] text-[12px] opacity-70">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlockTemoignage;
