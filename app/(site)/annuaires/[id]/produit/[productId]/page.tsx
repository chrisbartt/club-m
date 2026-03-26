import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, BadgeCheck, Package, Zap, Download } from "lucide-react";
import { auth } from "@/lib/auth";
import { getProductById } from "@/domains/business/queries";
import { getProfileById } from "@/domains/directory/queries";
import { CURRENCY_SYMBOLS } from "@/lib/constants";
import type { Currency } from "@/lib/generated/prisma/client";
import AppContainerWebSite from "@/components/common/containers/AppContainerWebSite";
import { PurchaseButton } from "@/components/orders/purchase-button";

interface PageProps {
  params: Promise<{ id: string; productId: string }>;
}

const TYPE_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  PHYSICAL: { label: "Produit physique", icon: <Package className="w-4 h-4" /> },
  SERVICE: { label: "Service", icon: <Zap className="w-4 h-4" /> },
  DIGITAL: { label: "Produit digital", icon: <Download className="w-4 h-4" /> },
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id, productId } = await params;

  const product = await getProductById(productId);
  if (!product || !product.isActive) notFound();

  // Verify this product belongs to the profile in the URL
  const profile = await getProfileById(id);
  if (!profile || product.businessId !== profile.id) notFound();

  const session = await auth();
  const isLoggedIn = !!session?.user;

  const symbol = CURRENCY_SYMBOLS[product.currency as Currency] ?? "$";
  const priceDisplay = `${Number(product.price).toLocaleString("fr-FR")} ${symbol}`;
  const typeInfo = TYPE_LABELS[product.type] ?? { label: product.type, icon: <ShoppingBag className="w-4 h-4" /> };
  const memberName = `${profile.member.firstName} ${profile.member.lastName}`;
  const memberAvatar = profile.member.avatar || "/images/default-avatar.png";

  const isOutOfStock = product.type === "PHYSICAL" && product.stock !== null && product.stock <= 0;

  return (
    <AppContainerWebSite>
      {/* Back link */}
      <div className="bg-[#f5f5f5]">
        <div className="max-w-[1200px] mx-auto px-4 pt-6 pb-2">
          <Link
            href={`/annuaires/${id}`}
            className="inline-flex items-center gap-2 text-sm text-[#091626]/70 hover:text-[#a55b46] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au profil de {profile.businessName}
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-[#f5f5f5] pb-20">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {/* Left: Images */}
            <div>
              {product.images.length > 0 ? (
                <div className="space-y-3">
                  {/* Main image */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  {/* Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {product.images.slice(1, 5).map((img, i) => (
                        <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-white">
                          <Image
                            src={img}
                            alt={`${product.name} - ${i + 2}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 25vw, 12vw"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-white flex items-center justify-center">
                  <ShoppingBag className="w-20 h-20 text-[#091626]/10" />
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="flex flex-col gap-6">
              {/* Product info card */}
              <div className="bg-white rounded-2xl p-6 lg:p-8">
                {/* Type badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#a55b46] bg-[#a55b46]/10 rounded-full px-3 py-1">
                    {typeInfo.icon}
                    {typeInfo.label}
                  </span>
                  {product.category?.name && (
                    <span className="inline-flex items-center text-xs font-medium text-[#091626]/60 bg-[#091626]/5 rounded-full px-3 py-1">
                      {product.category.name}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h1 className="text-2xl lg:text-3xl font-bold text-[#091626] mb-4">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-3xl lg:text-4xl font-bold text-[#091626]">
                    {priceDisplay}
                  </p>
                </div>

                {/* Stock info */}
                {product.type === "PHYSICAL" && product.stock !== null && (
                  <div className="mb-6">
                    {product.stock > 0 ? (
                      <p className="text-sm text-green-600 font-medium">
                        {product.stock} en stock
                      </p>
                    ) : (
                      <p className="text-sm text-red-500 font-medium">
                        Rupture de stock
                      </p>
                    )}
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#091626] mb-2">
                      Description
                    </h2>
                    <p className="text-[#091626]/70 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Purchase section */}
                <div className="border-t border-[#091626]/5 pt-6">
                  {isLoggedIn ? (
                    <PurchaseButton
                      productId={product.id}
                      price={Number(product.price)}
                      currency={product.currency}
                      disabled={isOutOfStock}
                      disabledReason={isOutOfStock ? "Ce produit est en rupture de stock" : undefined}
                    />
                  ) : (
                    <div className="space-y-3">
                      <Link
                        href="/connexion"
                        className="flex items-center justify-center w-full h-12 bg-[#091626] hover:bg-[#091626]/90 text-white font-medium rounded-xl transition-colors"
                      >
                        Connectez-vous pour acheter
                      </Link>
                      <p className="text-xs text-center text-[#091626]/50">
                        Vous devez avoir un compte pour passer commande.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Seller card */}
              <div className="bg-white rounded-2xl p-6">
                <h3 className="text-sm font-medium text-[#091626]/50 uppercase tracking-wider mb-4">
                  Vendu par
                </h3>
                <Link href={`/annuaires/${id}`} className="group">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={memberAvatar}
                        alt={memberName}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                      <div className="absolute -right-0.5 -bottom-0.5 w-5 h-5 bg-[#a55b46] rounded-full flex items-center justify-center border-2 border-white">
                        <BadgeCheck className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[#091626] font-semibold group-hover:text-[#a55b46] transition-colors truncate">
                        {profile.businessName}
                      </p>
                      <p className="text-sm text-[#091626]/50">
                        {memberName}
                      </p>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-[#091626]/30 ml-auto rotate-180 group-hover:text-[#a55b46] transition-colors shrink-0" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppContainerWebSite>
  );
}
