'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'clubm-cart'

interface CartItem {
  productId: string
  productName: string
  productImage: string | null
  price: number
  currency: string
  quantity: number
  type: 'PHYSICAL' | 'DIGITAL'
  stock: number | null
  variantId: string | null
  variantLabel: string | null
}

interface CartState {
  items: CartItem[]
  businessId: string | null
  businessName: string | null
  businessSlug: string | null
}

interface CartContextType {
  cart: CartState
  addItem: (
    item: CartItem,
    business: { id: string; name: string; slug: string },
  ) => boolean
  removeItem: (productId: string, variantId?: string | null) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void
  clearCart: () => void
  itemCount: number
  total: number
  currency: string
  hydrated: boolean
}

const emptyCart: CartState = {
  items: [],
  businessId: null,
  businessName: null,
  businessSlug: null,
}

const CartContext = createContext<CartContextType | null>(null)

function loadCart(): CartState {
  if (typeof window === 'undefined') return emptyCart
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyCart
    const parsed = JSON.parse(raw)
    if (parsed && Array.isArray(parsed.items)) return parsed as CartState
    return emptyCart
  } catch {
    return emptyCart
  }
}

function saveCart(cart: CartState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  } catch {
    // storage full or unavailable — ignore
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(emptyCart)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    setCart(loadCart())
    setHydrated(true)
  }, [])

  // Persist to localStorage on change (after hydration)
  useEffect(() => {
    if (hydrated) saveCart(cart)
  }, [cart, hydrated])

  const addItem = useCallback(
    (
      item: CartItem,
      business: { id: string; name: string; slug: string },
    ): boolean => {
      let added = false
      setCart((prev) => {
        // Mono-boutique check: different business already in cart
        if (prev.businessId && prev.businessId !== business.id && prev.items.length > 0) {
          added = false
          return prev
        }

        const existing = prev.items.find(
          (i) => i.productId === item.productId && (i.variantId ?? null) === (item.variantId ?? null),
        )

        // Respect stock limit
        if (existing) {
          const newQty = existing.quantity + item.quantity
          if (item.stock !== null && newQty > item.stock) {
            added = false
            return prev
          }
        } else if (item.stock !== null && item.quantity > item.stock) {
          added = false
          return prev
        }

        added = true

        if (existing) {
          return {
            ...prev,
            businessId: business.id,
            businessName: business.name,
            businessSlug: business.slug,
            items: prev.items.map((i) =>
              i.productId === item.productId && (i.variantId ?? null) === (item.variantId ?? null)
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            ),
          }
        }

        return {
          ...prev,
          businessId: business.id,
          businessName: business.name,
          businessSlug: business.slug,
          items: [...prev.items, item],
        }
      })
      return added
    },
    [],
  )

  const removeItem = useCallback((productId: string, variantId?: string | null) => {
    setCart((prev) => {
      const newItems = prev.items.filter(
        (i) => !(i.productId === productId && (i.variantId ?? null) === (variantId ?? null)),
      )
      if (newItems.length === 0) return emptyCart
      return { ...prev, items: newItems }
    })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string | null) => {
    if (quantity <= 0) {
      removeItem(productId, variantId)
      return
    }
    setCart((prev) => {
      const item = prev.items.find(
        (i) => i.productId === productId && (i.variantId ?? null) === (variantId ?? null),
      )
      if (!item) return prev
      if (item.stock !== null && quantity > item.stock) return prev
      return {
        ...prev,
        items: prev.items.map((i) =>
          i.productId === productId && (i.variantId ?? null) === (variantId ?? null)
            ? { ...i, quantity }
            : i,
        ),
      }
    })
  }, [removeItem])

  const clearCart = useCallback(() => {
    setCart(emptyCart)
  }, [])

  const itemCount = useMemo(
    () => cart.items.reduce((sum, i) => sum + i.quantity, 0),
    [cart.items],
  )

  const total = useMemo(
    () => cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart.items],
  )

  const currency = useMemo(
    () => (cart.items.length > 0 ? cart.items[0].currency : 'USD'),
    [cart.items],
  )

  const value = useMemo<CartContextType>(
    () => ({
      cart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      total,
      currency,
      hydrated,
    }),
    [cart, addItem, removeItem, updateQuantity, clearCart, itemCount, total, currency, hydrated],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
