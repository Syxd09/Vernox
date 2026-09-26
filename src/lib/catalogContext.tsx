import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { z } from 'zod';
import { products as defaultProducts, categories as defaultCategories, Product, ProductCategory } from './catalog';
export type { Product, ProductCategory };

import { auth, db, googleProvider } from './firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';

// Passphrase Salting & Hashing Helper
export function hashPassphrase(passphrase: string): string {
  let hash = 0x811c9dc5;
  const salt = "vernox-atelier-salt-2026";
  const salted = passphrase + salt;
  for (let i = 0; i < salted.length; i++) {
    hash ^= salted.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16);
}

export interface CustomerAccount {
  email: string;
  phone?: string;
  passwordHash?: string;
  name: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  isGoogleUser?: boolean;
  role?: 'admin' | 'customer';
  isAdmin?: boolean;
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  content: string;
  readTime: string;
  date: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  placedAt: number;
}

export interface HomepageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroSubtitleItalic: string;
  heroBadge: string;
  featuredProductIds: string[];
  manifestoItems: Array<{ icon: string; title: string; body: string }>;
  sectionsVisibility: Record<string, boolean>;
  sectionsOrder: string[];
  heroShapeId?: string;
  heroFinish?: string;
}

export type OrderStatus = 'Pending' | 'Pending_Payment' | 'Paid' | 'Designing' | 'Cutting' | 'Finished' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  shapeId: string;
  sizeLabel: string;
  widthMm: number;
  heightMm: number;
  finish: string;
  unitPrice: number;
  quantity: number;
  customDesignThumb?: string;
  customDesignRef?: string;
}

export interface Order {
  id: string;
  total: number;
  placedAt: number;
  createdAt?: number | string;
  email: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingName?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingZip?: string;
  shippingCountry?: string;
  trackingCarrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  adminNotes?: string;
}

export interface StoreConfig {
  storeName: string;
  currency: string;
  taxRate: number;
  freeShippingThreshold: number;
  shippingFee: number;
  adminPassphraseHash?: string;
  adminEmail?: string;
}

interface CatalogCtx {
  products: Product[];
  categories: { id: ProductCategory; name: string; description: string }[];
  homepageSettings: HomepageSettings;
  orders: Order[];
  topics: Topic[];
  storeConfig: StoreConfig;
  reviews: Review[];
  wishlist: string[];
  isAdmin: boolean;
  loginAdmin: (email: string, pass: string) => Promise<boolean>;
  
  // Product Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  
  // Category Actions
  addCategory: (category: { id: ProductCategory; name: string; description: string }) => void;
  updateCategory: (id: string, updates: Partial<{ id: ProductCategory; name: string; description: string }>) => void;
  deleteCategory: (id: string) => void;
  
  // Homepage Actions
  updateHomepageSettings: (updates: Partial<HomepageSettings>) => void;
  
  // Order Actions
  addOrder: (order: Omit<Order, 'status'> & { status?: OrderStatus }) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  deleteOrder: (orderId: string) => void;
  
  // Topic Actions
  addTopic: (topic: Omit<Topic, 'id'>) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;

  // Configuration Actions
  updateStoreConfig: (updates: Partial<StoreConfig>) => void;
  verifyAdminPassphrase: (passphrase: string) => boolean;

  // Review Actions
  addReview: (review: Omit<Review, 'id'>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;

  // Wishlist Actions
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;

  // DB Import with Validation
  importDatabase: (jsonData: string) => { success: boolean; error?: string };
  
  // Customer Auth Actions
  currentCustomer: CustomerAccount | null;
  loginCustomer: (emailOrPhone: string, pass: string) => Promise<boolean>;
  loginWithGoogleMock: (name: string, email: string) => Promise<void>;
  registerCustomer: (account: Omit<CustomerAccount, 'passwordHash'> & { password?: string }) => Promise<boolean>;
  logoutCustomer: () => Promise<void>;
  updateCustomerProfile: (updates: Partial<CustomerAccount>) => Promise<void>;

  // Reset
  resetAll: () => void;
}

const CatalogContext = createContext<CatalogCtx | null>(null);

// Validation Schemas
const ProductZSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  shapeId: z.string(),
  finishes: z.array(z.string()),
  sizes: z.array(z.object({
    label: z.string(),
    widthMm: z.number(),
    heightMm: z.number(),
    priceDelta: z.number()
  })),
  featured: z.boolean().optional(),
  bestseller: z.boolean().optional(),
  isNew: z.boolean().optional(),
  customizable: z.boolean().optional()
});

const CategoryZSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string()
});

const TopicZSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  content: z.string(),
  readTime: z.string(),
  date: z.string()
});

const OrderItemZSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  productSlug: z.string(),
  shapeId: z.string(),
  sizeLabel: z.string(),
  widthMm: z.number(),
  heightMm: z.number(),
  finish: z.string(),
  unitPrice: z.number(),
  quantity: z.number(),
  customDesignThumb: z.string().optional(),
  customDesignRef: z.string().optional()
});

const OrderZSchema = z.object({
  id: z.string(),
  total: z.number(),
  placedAt: z.number(),
  email: z.string().email(),
  status: z.enum(['Pending', 'Designing', 'Cutting', 'Finished', 'Shipped', 'Delivered']),
  items: z.array(OrderItemZSchema),
  shippingName: z.string().optional(),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingZip: z.string().optional(),
  shippingCountry: z.string().optional(),
  trackingCarrier: z.string().optional(),
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.string().optional(),
  adminNotes: z.string().optional()
});

const HomepageSettingsZSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroSubtitleItalic: z.string(),
  heroBadge: z.string(),
  featuredProductIds: z.array(z.string()),
  manifestoItems: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    body: z.string()
  })),
  sectionsVisibility: z.record(z.boolean()),
  sectionsOrder: z.array(z.string()),
  heroShapeId: z.string().optional(),
  heroFinish: z.string().optional()
});

const StoreConfigZSchema = z.object({
  storeName: z.string(),
  currency: z.string(),
  taxRate: z.number(),
  freeShippingThreshold: z.number(),
  shippingFee: z.number(),
  adminPassphraseHash: z.string().optional(),
  adminEmail: z.string().optional()
});

const DatabaseZSchema = z.object({
  products: z.array(ProductZSchema).optional(),
  categories: z.array(CategoryZSchema).optional(),
  homepageSettings: HomepageSettingsZSchema.optional(),
  orders: z.array(OrderZSchema).optional(),
  topics: z.array(TopicZSchema).optional(),
  storeConfig: StoreConfigZSchema.optional()
});

const DEFAULT_HOMEPAGE_SETTINGS: HomepageSettings = {
  heroTitle: "Metal, quietly held on the wall.",
  heroSubtitle: "Wall pieces cut from Belgian steel, finished by hand in oxblood-patinated brass and warm copper. Ready-made, or shape one that is entirely yours.",
  heroSubtitleItalic: "quietly",
  heroBadge: "Antwerp Atelier · Est. 2019",
  featuredProductIds: ['p-01', 'p-06', 'p-08'],
  manifestoItems: [
    { icon: 'Hammer', title: 'Cut in Antwerp', body: 'Every piece leaves one workshop, signed on the reverse.' },
    { icon: 'Compass', title: 'Yours, precisely', body: 'Change a millimetre, a metal, a monogram — live, in-browser.' },
    { icon: 'Flame', title: 'Ten-day lead', body: 'From raw sheet to your wall in under a fortnight.' },
  ],
  sectionsVisibility: {
    hero: true,
    manifesto: true,
    collections: true,
    featured: true,
    installations: true,
    story: true,
    'b2b-trade': true,
    authenticity: true,
    metallurgy: true,
    bestsellers: true,
    topics: true,
    'studio-cta': true
  },
  sectionsOrder: ['hero', 'manifesto', 'collections', 'featured', 'installations', 'story', 'b2b-trade', 'authenticity', 'metallurgy', 'bestsellers', 'topics', 'studio-cta'],
  heroShapeId: 'starburst',
  heroFinish: 'brass'
};

const DEFAULT_TOPICS: Topic[] = [
  {
    id: 't-1',
    title: 'Selecting the Perfect Metal Finish',
    category: 'Design Guide',
    content: 'Choosing the right finish for your metal art is key. Blackened steel offers a heavy, industrial, raw appearance with deep shading. Antique brass and warm gold bring a warm, light-catching glow to elegant monograms and geometric displays. Corten steel slowly patinates over months, creating a beautiful weathered copper-rust texture perfect for nature silhouettes outdoors.',
    readTime: '4 min read',
    date: 'July 10, 2026'
  },
  {
    id: 't-2',
    title: 'The Art of Fibre Laser Cutting',
    category: 'Workshop Notes',
    content: 'At the heart of the Antwerp atelier is our high-capacity fibre laser cutter. Operating at a micron level of accuracy, it slices 3mm high-grade Belgian sheet steel in seconds. Because of the precision beam, the cuts are extremely clean, requiring only minor manual brushing, ensuring every curve remains smooth and laser-sharp without distortion.',
    readTime: '6 min read',
    date: 'June 15, 2026'
  }
];

const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: "Vernox Atelier",
  currency: "₹",
  taxRate: 8,
  freeShippingThreshold: 150,
  shippingFee: 15,
  adminEmail: "concierge@vernoxatelier.com"
};

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('vernox-products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((p: Product) => {
            const def = defaultProducts.find(d => d.id === p.id);
            return def ? { ...def, ...p, imageUrl: p.imageUrl || def.imageUrl, lifestyleImage: p.lifestyleImage || def.lifestyleImage, alloySpec: p.alloySpec || def.alloySpec } : p;
          });
        }
      }
      return defaultProducts;
    } catch {
      return defaultProducts;
    }
  });

  const [categories, setCategories] = useState<{ id: ProductCategory; name: string; description: string }[]>(() => {
    try {
      const saved = localStorage.getItem('vernox-categories');
      return saved ? JSON.parse(saved) : defaultCategories;
    } catch {
      return defaultCategories;
    }
  });

  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(() => {
    try {
      const saved = localStorage.getItem('vernox-homepage');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new sections are incorporated if not already in saved order
        const baseOrder = DEFAULT_HOMEPAGE_SETTINGS.sectionsOrder;
        const savedOrder: string[] = parsed.sectionsOrder || [];
        const mergedOrder = [...savedOrder];
        for (const sec of baseOrder) {
          if (!mergedOrder.includes(sec)) {
            // Insert before bestsellers or push
            const bsIndex = mergedOrder.indexOf('bestsellers');
            if (bsIndex !== -1) {
              mergedOrder.splice(bsIndex, 0, sec);
            } else {
              mergedOrder.push(sec);
            }
          }
        }

        return {
          ...DEFAULT_HOMEPAGE_SETTINGS,
          ...parsed,
          sectionsVisibility: { ...DEFAULT_HOMEPAGE_SETTINGS.sectionsVisibility, ...(parsed.sectionsVisibility || {}) },
          sectionsOrder: mergedOrder
        };
      }
      return DEFAULT_HOMEPAGE_SETTINGS;
    } catch {
      return DEFAULT_HOMEPAGE_SETTINGS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('vernox-orders');
      if (saved) {
        const rawOrders = JSON.parse(saved);
        return rawOrders.map((o: any) => ({
          ...o,
          status: o.status || 'Pending'
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [topics, setTopics] = useState<Topic[]>(() => {
    try {
      const saved = localStorage.getItem('vernox-topics');
      return saved ? JSON.parse(saved) : DEFAULT_TOPICS;
    } catch {
      return DEFAULT_TOPICS;
    }
  });

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('vernox-store-config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.currency || parsed.currency === '$' || parsed.currency === 'USD') {
          parsed.currency = '₹';
          try {
            localStorage.setItem('vernox-store-config', JSON.stringify(parsed));
          } catch {}
        }
        return parsed;
      }
      return DEFAULT_STORE_CONFIG;
    } catch {
      return DEFAULT_STORE_CONFIG;
    }
  });

  const [currentCustomer, setCurrentCustomer] = useState<CustomerAccount | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vernox-wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync active customer changes into customer email for compatibility
  useEffect(() => {
    if (currentCustomer) {
      localStorage.setItem('vernox-customer-email', currentCustomer.email);
    } else {
      localStorage.removeItem('vernox-customer-email');
    }
  }, [currentCustomer]);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as CustomerAccount;
            const email = (user.email || data.email || '').toLowerCase();
            const VERIFIED_ADMINS = [
              'admin@vernox.com',
              'concierge@vernoxatelier.com',
              (storeConfig?.adminEmail || '').toLowerCase()
            ].filter(Boolean);

            const isAdminUser = VERIFIED_ADMINS.includes(email) ||
                                Boolean(data.role === 'admin') ||
                                Boolean(data.isAdmin);

            setCurrentCustomer({
              ...data,
              email: user.email || data.email || '',
              phone: user.phoneNumber || data.phone || '',
              name: data.name || user.displayName || 'Atelier Customer',
              role: isAdminUser ? 'admin' : (data.role || 'customer'),
              isAdmin: isAdminUser
            });
          } else {
            const email = (user.email || '').toLowerCase();
            const VERIFIED_ADMINS = [
              'admin@vernox.com',
              'concierge@vernoxatelier.com',
              (storeConfig?.adminEmail || '').toLowerCase()
            ].filter(Boolean);
            const isAdminUser = VERIFIED_ADMINS.includes(email);

            // Write fallback document
            const fallbackProfile: CustomerAccount = {
              email: user.email || '',
              phone: user.phoneNumber || '',
              name: user.displayName || 'Atelier Customer',
              isGoogleUser: !!user.providerData.find(p => p.providerId === 'google.com'),
              role: isAdminUser ? 'admin' : 'customer',
              isAdmin: isAdminUser
            };
            try {
              await setDoc(docRef, fallbackProfile);
            } catch (writeErr) {
              console.warn("Notice: Firestore profile write deferred:", (writeErr as any)?.message || writeErr);
            }
            setCurrentCustomer(fallbackProfile);
          }
        } catch (e: any) {
          // Gracefully fallback to local profile when Firestore rules or network are offline
          console.info("Using local customer profile fallback (Firestore offline or restricted):", e?.message || e);
          const email = (user.email || '').toLowerCase();
          const isAdminUser = email === 'admin@vernox.com' || email === 'concierge@vernoxatelier.com';
          const fallbackProfile: CustomerAccount = {
            email: user.email || '',
            phone: user.phoneNumber || '',
            name: user.displayName || 'Atelier Customer',
            isGoogleUser: !!user.providerData.find(p => p.providerId === 'google.com'),
            role: isAdminUser ? 'admin' : 'customer',
            isAdmin: isAdminUser
          };
          setCurrentCustomer(fallbackProfile);
        }
      } else {
        setCurrentCustomer(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load and seed Firestore database collections in parallel
  useEffect(() => {
    let isCancelled = false;
    const syncFirestore = async () => {
      try {
        const [productsRes, categoriesRes, homepageRes, topicsRes, configRes, reviewsRes] = await Promise.allSettled([
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'categories')),
          getDoc(doc(db, 'settings', 'homepage')),
          getDocs(collection(db, 'topics')),
          getDoc(doc(db, 'config', 'store')),
          getDocs(collection(db, 'reviews'))
        ]);

        if (isCancelled) return;

        // 1. Products
        if (productsRes.status === 'fulfilled') {
          const productsSnap = productsRes.value;
          if (productsSnap.empty) {
            defaultProducts.forEach(p => { setDoc(doc(db, 'products', p.id), p).catch(() => {}); });
            setProducts(defaultProducts);
          } else {
            setProducts(productsSnap.docs.map(d => d.data() as Product));
          }
        }

        // 2. Categories
        if (categoriesRes.status === 'fulfilled') {
          const categoriesSnap = categoriesRes.value;
          if (categoriesSnap.empty) {
            defaultCategories.forEach(c => { setDoc(doc(db, 'categories', c.id), c).catch(() => {}); });
            setCategories(defaultCategories);
          } else {
            setCategories(categoriesSnap.docs.map(d => d.data() as any));
          }
        }

        // 3. Homepage Settings
        if (homepageRes.status === 'fulfilled') {
          const homepageDoc = homepageRes.value;
          if (!homepageDoc.exists()) {
            setDoc(doc(db, 'settings', 'homepage'), DEFAULT_HOMEPAGE_SETTINGS).catch(() => {});
            setHomepageSettings(DEFAULT_HOMEPAGE_SETTINGS);
          } else {
            setHomepageSettings(homepageDoc.data() as HomepageSettings);
          }
        }

        // 4. Topics
        if (topicsRes.status === 'fulfilled') {
          const topicsSnap = topicsRes.value;
          if (topicsSnap.empty) {
            DEFAULT_TOPICS.forEach(t => { setDoc(doc(db, 'topics', t.id), t).catch(() => {}); });
            setTopics(DEFAULT_TOPICS);
          } else {
            setTopics(topicsSnap.docs.map(d => d.data() as Topic));
          }
        }

        // 5. Store Config
        if (configRes.status === 'fulfilled') {
          const configDoc = configRes.value;
          if (!configDoc.exists()) {
            setDoc(doc(db, 'config', 'store'), DEFAULT_STORE_CONFIG).catch(() => {});
            setStoreConfig(DEFAULT_STORE_CONFIG);
          } else {
            const loaded = configDoc.data() as StoreConfig;
            if (loaded.currency === '$') {
              loaded.currency = '₹';
              updateDoc(doc(db, 'config', 'store'), { currency: '₹' }).catch(() => {});
            }
            setStoreConfig(loaded);
          }
        }

        // 6. Reviews
        if (reviewsRes.status === 'fulfilled') {
          const snap = reviewsRes.value;
          setReviews(snap.docs.map(d => d.data() as Review));
        }
      } catch (e: any) {
        if (e?.code !== 'permission-denied' && !String(e?.message).includes('insufficient permissions')) {
          console.warn("Firestore sync:", e?.message || e);
        }
      }
    };
    syncFirestore();
    return () => { isCancelled = true; };
  }, []);

  // Load wishlist from Firestore for logged-in user or sync from guest localStorage
  useEffect(() => {
    const loadWishlist = async () => {
      if (currentCustomer && auth.currentUser) {
        try {
          const docRef = doc(db, 'wishlists', auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setWishlist(data.productIds || []);
          } else {
            await setDoc(docRef, { productIds: wishlist });
          }
        } catch (e: any) {
          if (e?.code !== 'permission-denied' && !String(e?.message).includes('insufficient permissions')) {
            console.warn("Firestore wishlist sync:", e?.message || e);
          }
        }
      } else {
        try {
          const saved = localStorage.getItem('vernox-wishlist');
          setWishlist(saved ? JSON.parse(saved) : []);
        } catch {
          setWishlist([]);
        }
      }
    };
    loadWishlist();
  }, [currentCustomer]);

  // Sync guest wishlist to localStorage
  useEffect(() => {
    if (!currentCustomer) {
      localStorage.setItem('vernox-wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, currentCustomer]);

  // Load all orders from Cloud Firestore for cross-device & admin sync
  useEffect(() => {
    const loadAllOrders = async () => {
      try {
        const snap = await getDocs(collection(db, 'orders'));
        const list = snap.docs.map(d => d.data() as Order);
        if (list.length > 0) {
          setOrders(list);
        }
      } catch (e: any) {
        if (e?.code !== 'permission-denied' && !String(e?.message).includes('insufficient permissions')) {
          console.warn("Firestore orders sync:", e?.message || e);
        }
      }
    };
    loadAllOrders();
  }, []);

  // Backup sync to localStorage for rapid access fallback
  useEffect(() => {
    localStorage.setItem('vernox-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('vernox-categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('vernox-homepage', JSON.stringify(homepageSettings));
  }, [homepageSettings]);

  useEffect(() => {
    localStorage.setItem('vernox-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('vernox-topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('vernox-store-config', JSON.stringify(storeConfig));
  }, [storeConfig]);

  // Product Actions
  const addProduct = async (p: Omit<Product, 'id'>) => {
    const newId = `p-${Date.now()}`;
    const newProduct = { ...p, id: newId };
    setProducts(prev => [...prev, newProduct]);
    try {
      await setDoc(doc(db, 'products', newId), newProduct);
    } catch (e) {
      console.error("Firestore add product error:", e);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    try {
      await updateDoc(doc(db, 'products', id), updates);
    } catch (e) {
      console.error("Firestore update product error:", e);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.error("Firestore delete product error:", e);
    }
  };

  const getProductBySlug = (slug: string) => {
    return products.find(p => p.slug === slug);
  };

  // Category Actions
  const addCategory = async (c: { id: ProductCategory; name: string; description: string }) => {
    setCategories(prev => [...prev, c]);
    try {
      await setDoc(doc(db, 'categories', c.id), c);
    } catch (e) {
      console.error("Firestore add category error:", e);
    }
  };

  const updateCategory = async (id: string, updates: Partial<{ id: ProductCategory; name: string; description: string }>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    try {
      await updateDoc(doc(db, 'categories', id), updates);
    } catch (e) {
      console.error("Firestore update category error:", e);
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e) {
      console.error("Firestore delete category error:", e);
    }
  };

  // Homepage Actions
  const updateHomepageSettings = async (updates: Partial<HomepageSettings>) => {
    const nextSettings = { ...homepageSettings, ...updates };
    setHomepageSettings(nextSettings);
    try {
      await setDoc(doc(db, 'settings', 'homepage'), nextSettings);
    } catch (e) {
      console.error("Firestore update homepage error:", e);
    }
  };

  // Order Actions
  const addOrder = async (order: Omit<Order, 'status'> & { status?: OrderStatus }) => {
    const completeOrder: Order = {
      ...order,
      status: order.status || 'Pending'
    };
    setOrders(prev => [...prev, completeOrder]);
    try {
      await setDoc(doc(db, 'orders', completeOrder.id), {
        ...completeOrder,
        placedAt: Date.now()
      });
    } catch (e) {
      console.error("Firestore order save error:", e);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (e) {
      console.error("Firestore order status update error:", e);
    }
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
    try {
      await updateDoc(doc(db, 'orders', orderId), updates);
    } catch (e) {
      console.error("Firestore order update error:", e);
    }
  };

  const deleteOrder = async (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (e) {
      console.error("Firestore order deletion error:", e);
    }
  };

  // Topic Actions
  const addTopic = async (t: Omit<Topic, 'id'>) => {
    const newId = `t-${Date.now()}`;
    const newTopic = { ...t, id: newId };
    setTopics(prev => [...prev, newTopic]);
    try {
      await setDoc(doc(db, 'topics', newId), newTopic);
    } catch (e) {
      console.error("Firestore add topic error:", e);
    }
  };

  const updateTopic = async (id: string, updates: Partial<Topic>) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    try {
      await updateDoc(doc(db, 'topics', id), updates);
    } catch (e) {
      console.error("Firestore update topic error:", e);
    }
  };

  const deleteTopic = async (id: string) => {
    setTopics(prev => prev.filter(t => t.id !== id));
    try {
      await deleteDoc(doc(db, 'topics', id));
    } catch (e) {
      console.error("Firestore delete topic error:", e);
    }
  };

  // Store Configuration Actions
  const updateStoreConfig = async (updates: Partial<StoreConfig>) => {
    const nextConfig = { ...storeConfig, ...updates };
    setStoreConfig(nextConfig);
    try {
      await setDoc(doc(db, 'config', 'store'), nextConfig);
    } catch (e) {
      console.error("Firestore update store config error:", e);
    }
  };

  const isAdmin = Boolean(
    currentCustomer && (
      currentCustomer.role === 'admin' ||
      currentCustomer.isAdmin === true ||
      currentCustomer.email.toLowerCase() === (storeConfig.adminEmail || 'admin@vernox.com').toLowerCase() ||
      currentCustomer.email.toLowerCase() === 'concierge@vernoxatelier.com'
    )
  );

  const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const isDesignatedAdmin = 
      cleanEmail === 'admin@vernox.com' || 
      cleanEmail === 'concierge@vernoxatelier.com' ||
      cleanEmail === (storeConfig.adminEmail || '').toLowerCase();

    if (!isDesignatedAdmin) {
      return false;
    }

    // 1. Try Firebase Authentication sign-in
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
      return true;
    } catch (authErr: any) {
      console.warn("Standard Firebase Auth sign-in notice:", authErr?.code || authErr?.message);

      // If user doesn't exist yet in Firebase Auth, auto-provision it with the provided password
      if (authErr?.code === 'auth/user-not-found' || authErr?.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, cleanEmail, pass);
          return true;
        } catch (createErr) {
          console.warn("Notice: could not auto-create admin in Firebase Auth:", createErr);
        }
      }

      // 2. Dev & Atelier Master Passphrase Fallback:
      // Accepts standard atelier master passphrases ('admin123', 'vernox2026', 'admin')
      const isMasterPass = pass === 'admin123' || pass === 'vernox2026' || pass === 'admin';
      if (isMasterPass || process.env.NODE_ENV !== 'production') {
        const adminProfile: CustomerAccount = {
          email: cleanEmail,
          name: cleanEmail === 'admin@vernox.com' ? 'Atelier Administrator' : 'Vernox Concierge',
          role: 'admin',
          isAdmin: true,
          phone: '+32 3 205 0000',
          city: 'Antwerp',
          country: 'Belgium'
        };
        setCurrentCustomer(adminProfile);
        try {
          localStorage.setItem('vernox-customer-profile', JSON.stringify(adminProfile));
        } catch {}
        return true;
      }

      return false;
    }
  };

  const verifyAdminPassphrase = (_passphrase: string) => {
    return isAdmin;
  };

  // Review Actions
  const addReview = async (r: Omit<Review, 'id'>) => {
    const newId = `r-${Date.now()}`;
    const newReview = { ...r, id: newId };
    setReviews(prev => [...prev, newReview]);
    try {
      await setDoc(doc(db, 'reviews', newId), newReview);
    } catch (e) {
      console.error("Firestore add review error:", e);
    }
  };

  const deleteReview = async (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (e) {
      console.error("Firestore delete review error:", e);
    }
  };

  // Wishlist Actions
  const toggleWishlist = async (productId: string) => {
    let newWishlist: string[];
    if (wishlist.includes(productId)) {
      newWishlist = wishlist.filter(id => id !== productId);
    } else {
      newWishlist = [...wishlist, productId];
    }
    setWishlist(newWishlist);

    if (currentCustomer && auth.currentUser) {
      try {
        await setDoc(doc(db, 'wishlists', auth.currentUser.uid), { productIds: newWishlist });
      } catch (e) {
        console.error("Error updating wishlist in Firestore:", e);
      }
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Database JSON Import with Zod validation
  const importDatabase = (jsonData: string): { success: boolean; error?: string } => {
    try {
      const data = JSON.parse(jsonData);
      const parsed = DatabaseZSchema.safeParse(data);
      if (!parsed.success) {
        const errorMsg = parsed.error.errors.map(err => {
          const path = err.path.join('.');
          return `${path ? `Field [${path}]` : 'Data'}: ${err.message}`;
        }).join('\n');
        return { success: false, error: errorMsg };
      }
      
      const valid = parsed.data;
      if (valid.products) setProducts(valid.products as Product[]);
      if (valid.categories) setCategories(valid.categories as any);
      if (valid.homepageSettings) setHomepageSettings(valid.homepageSettings as HomepageSettings);
      if (valid.orders) setOrders(valid.orders as Order[]);
      if (valid.topics) setTopics(valid.topics as Topic[]);
      if (valid.storeConfig) setStoreConfig(valid.storeConfig as StoreConfig);
      
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Malformed JSON syntax' };
    }
  };

  // Customer Auth Implementation
  const loginCustomer = async (emailOrPhone: string, pass: string): Promise<boolean> => {
    try {
      if (emailOrPhone.includes('@')) {
        await signInWithEmailAndPassword(auth, emailOrPhone.trim().toLowerCase(), pass);
        return true;
      }
      const q = query(collection(db, 'users'), where('phone', '==', emailOrPhone.trim()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const userData = snap.docs[0].data();
        await signInWithEmailAndPassword(auth, userData.email, pass);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Firebase Login Error:", e);
      return false;
    }
  };

  const loginWithGoogleMock = async (name: string, email: string) => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Google OAuth Error:", e);
      throw e;
    }
  };

  const registerCustomer = async (account: Omit<CustomerAccount, 'passwordHash'> & { password?: string }): Promise<boolean> => {
    try {
      if (!account.password) return false;
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        account.email.trim().toLowerCase(), 
        account.password
      );
      const user = userCredential.user;
      const docRef = doc(db, 'users', user.uid);
      const profile: CustomerAccount = {
        email: account.email.trim().toLowerCase(),
        phone: account.phone || '',
        name: account.name,
        address: account.address || '',
        city: account.city || '',
        zip: account.zip || '',
        country: account.country || 'United States',
        isGoogleUser: false
      };
      try {
        await setDoc(docRef, profile);
      } catch (e) {
        console.error("Firestore user profile save failed, using local mode:", e);
      }
      setCurrentCustomer(profile);
      return true;
    } catch (e) {
      console.error("Firebase Registration Error:", e);
      return false;
    }
  };

  const logoutCustomer = async () => {
    try {
      await signOut(auth);
      setCurrentCustomer(null);
    } catch (e) {
      console.error("Firebase Signout Error:", e);
    }
  };

  const updateCustomerProfile = async (updates: Partial<CustomerAccount>) => {
    if (!auth.currentUser) return;
    const { passwordHash, ...profileUpdates } = updates;
    setCurrentCustomer(prev => prev ? { ...prev, ...profileUpdates } : null);
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, profileUpdates);
    } catch (e) {
      console.error("Firebase Profile Update Error (offline mode):", e);
    }
  };

  // Reset
  const resetAll = () => {
    setProducts(defaultProducts);
    setCategories(defaultCategories);
    setHomepageSettings(DEFAULT_HOMEPAGE_SETTINGS);
    setOrders([]);
    setTopics(DEFAULT_TOPICS);
    setStoreConfig(DEFAULT_STORE_CONFIG);
    setCurrentCustomer(null);
    localStorage.removeItem('vernox-products');
    localStorage.removeItem('vernox-categories');
    localStorage.removeItem('vernox-homepage');
    localStorage.removeItem('vernox-orders');
    localStorage.removeItem('vernox-topics');
    localStorage.removeItem('vernox-store-config');
    localStorage.removeItem('vernox-customer-email');
  };

  return (
    <CatalogContext.Provider value={{
      products,
      categories,
      homepageSettings,
      orders,
      topics,
      storeConfig: {
        ...storeConfig,
        currency: (!storeConfig.currency || storeConfig.currency === '$') ? '₹' : storeConfig.currency
      },
      reviews,
      wishlist,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductBySlug,
      addCategory,
      updateCategory,
      deleteCategory,
      updateHomepageSettings,
      addOrder,
      updateOrderStatus,
      updateOrder,
      deleteOrder,
      addTopic,
      updateTopic,
      deleteTopic,
      updateStoreConfig,
      verifyAdminPassphrase,
      importDatabase,
      isAdmin,
      loginAdmin,
      currentCustomer,
      loginCustomer,
      loginWithGoogleMock,
      registerCustomer,
      logoutCustomer,
      updateCustomerProfile,
      addReview,
      deleteReview,
      toggleWishlist,
      isInWishlist,
      resetAll
    }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const c = useContext(CatalogContext);
  if (!c) throw new Error('useCatalog must be used within CatalogProvider');
  return c;
}
