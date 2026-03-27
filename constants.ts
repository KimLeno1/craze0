
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Midnight Cyber Cloak',
    price: 850,
    originalPrice: 1200,
    // Added shippingFee to satisfy Product interface
    shippingFee: 45,
    category: 'Apparel',
    gender: 'UNISEX',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800',
    description: 'Limited edition technical outerwear with integrated fiber-optic lining.',
    details: ['Water-resistant tech shell', 'Oversized silhouette', 'Serial numbered #001-100'],
    inStock: true,
    isNew: true,
    viewers: 124,
    stockCount: 3,
    hypeScore: 98,
    synergyPath: 'CYBER',
    appeal: 'STREETS',
    brand: 'NEO-TECH',
    velocityScore: 95,
    tags: ['CYBER', 'TECHWEAR', 'POWER'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '2',
    name: 'Neon Glitch Sneakers',
    price: 350,
    originalPrice: 450,
    // Added shippingFee to satisfy Product interface
    shippingFee: 25,
    category: 'Accessories',
    gender: 'UNISEX',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
    description: 'Deconstructed footwear featuring reactive "Glitch" sole technology.',
    details: ['Recycled mesh upper', 'Impact-ready sole', 'UV-responsive laces'],
    inStock: true,
    viewers: 89,
    stockCount: 12,
    hypeScore: 82,
    synergyPath: 'CYBER',
    appeal: 'STREETS',
    brand: 'GLITCH',
    velocityScore: 78,
    tags: ['CYBER', 'STREETWEAR'],
    sizes: ['38', '40', '42', '44']
  },
  {
    id: '3',
    name: 'Holographic Utility Vest',
    price: 220,
    originalPrice: 300,
    // Added shippingFee to satisfy Product interface
    shippingFee: 20,
    category: 'Apparel',
    gender: 'MALE',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    description: 'Modular storage solution with iridescent structural panels.',
    details: ['8 tactical compartments', 'Adjustable harness', 'Reflective finish'],
    inStock: true,
    isNew: true,
    viewers: 56,
    stockCount: 5,
    hypeScore: 75,
    synergyPath: 'LUXE',
    appeal: 'CASUAL',
    brand: 'NEO-TECH',
    velocityScore: 60,
    tags: ['CYBER', 'POWER', 'UTILITY'],
    sizes: ['S', 'M', 'L']
  },
  {
    id: '4',
    name: 'Liquid Chrome Mini Bag',
    price: 195,
    originalPrice: 250,
    // Added shippingFee to satisfy Product interface
    shippingFee: 15,
    category: 'Accessories',
    gender: 'FEMALE',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    description: 'Sculptural accessory finished in vacuum-plated high-shine silver.',
    details: ['Full grain leather interior', 'Magnetic closure', 'Detachable chain'],
    inStock: true,
    viewers: 212,
    stockCount: 2,
    hypeScore: 94,
    synergyPath: 'VOID',
    appeal: 'OLD MONEY',
    brand: 'CHROME-LUXE',
    velocityScore: 92,
    tags: ['CLASSIC', 'LUXE', 'POWER'],
    sizes: ['OS']
  },
  {
    id: '5',
    name: 'Titanium Link Choker',
    price: 145,
    originalPrice: 190,
    // Added shippingFee to satisfy Product interface
    shippingFee: 10,
    category: 'Accessories',
    gender: 'UNISEX',
    image: 'https://images.unsplash.com/photo-1573408302354-014545c92557?auto=format&fit=crop&q=80&w=800',
    description: 'Heavyweight industrial chain designed for the modern metropolitan.',
    details: ['Aircraft grade titanium', 'Laser engraved logo', 'Quick-release clasp'],
    inStock: false,
    viewers: 15,
    stockCount: 0,
    hypeScore: 40,
    synergyPath: 'VOID',
    appeal: 'STREETS',
    brand: 'TITAN-IND',
    velocityScore: 20,
    tags: ['VOID', 'INDUSTRIAL'],
    sizes: ['OS']
  },
  {
    id: '6',
    name: 'Void Fragrance No. 01',
    price: 120,
    originalPrice: 150,
    // Added shippingFee to satisfy Product interface
    shippingFee: 15,
    category: 'Beauty',
    gender: 'UNISEX',
    image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=800',
    description: 'Notes of cold metal, ozone, and dark cedar.',
    details: ['100ml Parfum', 'Limited glass vessel', 'Sustainably sourced'],
    inStock: true,
    viewers: 34,
    stockCount: 45,
    hypeScore: 65,
    synergyPath: 'VOID',
    appeal: 'OLD MONEY',
    brand: 'VOID-ESSENCE',
    velocityScore: 55,
    tags: ['OLD MONEY', 'CLASSIC', 'VOID'],
    sizes: ['100ML']
  }
];

export const PATHS = [
  {
    id: 'CYBER',
    name: 'The Style Vanguard',
    icon: '⚡',
    color: 'from-pink-500 to-purple-600',
    description: 'Master of technical silhouettes and neon aesthetics.',
    perks: ['+15% XP on Cyber drops', 'Exclusive "Vanguard" Badge', 'Priority access to tech-wear']
  },
  {
    id: 'LUXE',
    name: 'The Ethereal Heir',
    icon: '💎',
    color: 'from-blue-400 to-indigo-600',
    description: 'Signals status through sculpted silk and quiet luxury.',
    perks: ['-10% Gem cost in Vault', 'VIP Lounge Access', 'Status multiplier']
  },
  {
    id: 'VOID',
    name: 'The Void Minimalist',
    icon: '🌑',
    color: 'from-zinc-700 to-black',
    description: 'Power through form and the absence of noise.',
    perks: ['Unique "Void" shader', 'Rare material discovery', 'Form-over-function bonus']
  }
];
