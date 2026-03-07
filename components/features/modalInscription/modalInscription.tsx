import { useDialog } from "@/context/dialog/contextDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";


const ModalInscription = () => {
  const { isDialogOpen, closeDialog } = useDialog();
  
  return (
    <Dialog
      open={isDialogOpen("inscriptionDialog")}
      onOpenChange={() => closeDialog("inscriptionDialog")}
    >
      <DialogContent
        className="sm:max-w-xl w-full border-0 bg-white rounded-[24px] pt-0 gap-0 max-h-[calc(100%-8rem)] flex flex-col p-0 focus-visite:outline-none focus-visite:ring-0 focus-visite:ring-offset-0 overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader className="relative flex-col gap-0 py-3 lg:py-4 px-3 lg:px-6 border-b border-borderInput">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="flex items-center gap-2 text-xl lg:text-2xl font-medium text-[#091626] ">
              Réservation
            </DialogTitle>
            <Button
              onClick={() => closeDialog("inscriptionDialog")}
              className="p-0 h-8 w-8 cursor-pointer rounded-full bg-transparent hover:bg-[#f5f5f5] hover:text-colorTitle transition-colors group shadow-none"
              aria-label="Fermer"
            >
              <span>
                <X className="w-[20px!important] h-[20px!important] text-[#091626] group-hover:text-[#091626]" />
              </span>
            </Button>
          </div>

          {/* Bouton de fermeture personnalisé */}
        </DialogHeader>
        <div className="overflow-y-auto overflow-hidden flex-1 lg:px-6 px-4 lg:py-3 py-2 relative z-10">
          <div className="grid grid-cols-12 lg:gap-4 gap-2">
            <div className="col-span-12 lg:col-span-6">
              <label
                htmlFor="prenom"
                className="block text-sm font-medium text-[#091626] mb-2"
              >
                Prénom
              </label>
              <Input
                type="text"
                id="prenom"
                name="prenom"
                // value={formData.prenom}
                // onChange={handleInputChange}
                className={`shadow-none h-[46px] focus-visible:ring-0 focus-visible:border-[#091626] rounded-lg`}
                required
                placeholder="Votre prénom"
              />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <label
                htmlFor="nom"
                className="block text-sm font-medium text-[#091626] mb-2"
              >
                Nom
              </label>
              <Input
                type="text"
                id="nom"
                name="nom"
                // value={formData.nom}
                // onChange={handleInputChange}
                className={`shadow-none h-[46px] focus-visible:ring-0 focus-visible:border-[#091626] rounded-lg`}
                required
                placeholder="Votre nom"
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#091626] mb-2"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                // value={formData.email}
                // onChange={handleInputChange}
                className={`shadow-none h-[46px] focus-visible:ring-0 focus-visible:border-[#091626] rounded-lg`}
                required
                placeholder="Votre email"
              />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <label
                htmlFor="telephone"
                className="block text-sm font-medium text-[#091626] mb-2"
              >
                Téléphone
              </label>
              <Input
                type="text"
                id="telephone"
                name="telephone"
                // value={formData.telephone}
                // onChange={handleInputChange}
                className={`shadow-none h-[46px] focus-visible:ring-0 focus-visible:border-[#091626] rounded-lg`}
                required
                placeholder="+243810000001"
              />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <label
                htmlFor="trancheAge"
                className="block text-sm font-medium text-[#091626] mb-2"
              >
                Tranche d&apos;âge
              </label>
              <Select>
                <SelectTrigger className="shadow-none h-[46px!important] focus-visible:ring-0 focus-visible:border-[#091626] rounded-lg w-full">
                  <SelectValue placeholder="Choissisez votre tranche d'âge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-29">18-29</SelectItem>
                  <SelectItem value="30-40">30-40</SelectItem>
                  <SelectItem value="41-50">41-50</SelectItem>
                  <SelectItem value="plus de 50">plus de 50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#091626] mb-2"
              >
                Statut entrepreneurial
              </label>
              <Select>
                <SelectTrigger className="shadow-none h-[46px!important] focus-visible:ring-0 focus-visible:border-[#091626] rounded-lg w-full">
                  <SelectValue placeholder="Choissisez votre statut entrepreneurial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="J'ai un business">
                    J&apos;ai un business.
                  </SelectItem>
                  <SelectItem value="Je suis en cours de création">
                    Je suis en cours de création.
                  </SelectItem>
                  <SelectItem value="Je suis en recherche d'idée">
                    Je suis en recherche d&apos;idée.
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* {statutEntrepreneurial === "J'ai un business" && ( */}
              <div className="col-span-12">
                <label
                  htmlFor="lequel"
                  className="block text-sm font-medium text-[#091626] mb-2"
                >
                  Lequel ?
                </label>
                <Input
                  type="text"
                  id="lequel"
                  name="lequel"
                  // value={formData.lequel}
                  // onChange={handleInputChange}
                  className={`shadow-none h-[46px] focus-visible:ring-0 focus-visible:border-[#091626] rounded-lg`}
                  required
                  placeholder="Le nom de votre business"
                />
              </div>
            {/* )} */}
          </div>
          {/* {showSuccessMessage && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800/35 font-medium text-sm">
                ✅ Inscription réussie ! Votre réservation a été créée avec
                succès.
              </p>
            </div>
          )}
          {error && !showSuccessMessage && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">❌ Erreur : {error}</p>
            </div>
          )} */}
        </div>
        <DialogFooter className="lg:px-6 px-4 lg:py-4 py-3">
          <div className="flex gap-1 w-full">
            <Button
              className="mt-4 w-1/2 md:h-12 h-10 rounded-lg bg-[#f5f5f5] hover:bg-[#f5f5f5]/90 text-[#091626] hover:text-[#091626] cursor-pointer shadow-none"
              onClick={() => closeDialog("inscriptionDialog")}
              // disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              className="mt-4 w-1/2 md:h-12 h-10 rounded-lg bg-[#a55b46] hover:bg-[#a55b46]/90 text-white cursor-pointer shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
              // onClick={handleSubmit}
              // disabled={isLoading || !statutEntrepreneurial || !trancheAge}
            >
              {/* {isLoading ? "Envoi..." : "Réserver"} */}
              Réserver
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalInscription;
