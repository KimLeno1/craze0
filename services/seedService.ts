import { db, auth } from '../firebase';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Product, User, Supplier, Order, Bundle, SocialPost } from '../types';
import { EXTENDED_PRODUCTS, MOCK_ORDERS } from '../mockData';

export const seedDatabase = async () => {
  console.log('Starting database seeding...');

  // 1. Seed Products
  const productsCol = collection(db, 'products');
  const productsSnapshot = await getDocs(productsCol);
  if (productsSnapshot.empty) {
    console.log('Seeding products...');
    for (const p of EXTENDED_PRODUCTS) {
      await setDoc(doc(db, 'products', p.id), {
        ...p,
        supplierId: 'sup1', // Default supplier for now
        shippingFee: 25
      });
    }
  }

  // 2. Seed Suppliers
  const suppliersCol = collection(db, 'suppliers');
  const suppliersSnapshot = await getDocs(suppliersCol);
  if (suppliersSnapshot.empty) {
    console.log('Seeding suppliers...');
    const mockSuppliers = [
      { id: 'sup1', name: 'CyberKnit Industries', contactEmail: 'ops@cyberknit.nt', region: 'Neo Tokyo Central', status: 'ACTIVE', performanceScore: 94, totalRevenueYield: 450000, joinedDate: '2024-01-12' },
      { id: 'sup2', name: 'Void Loom Textiles', contactEmail: 'archive@voidloom.de', region: 'Neo Berlin', status: 'ACTIVE', performanceScore: 82, totalRevenueYield: 280000, joinedDate: '2024-03-05' }
    ];
    for (const s of mockSuppliers) {
      await setDoc(doc(db, 'suppliers', s.id), s);
    }
  }

  // 3. Create Demo Accounts
  const demoUsers = [
    { email: 'admin@closetkraze.com', password: 'password123', handle: 'Admin_Zero', role: 'admin', archetype: 'CYBER' },
    { email: 'supplier@closetkraze.com', password: 'password123', handle: 'Supplier_One', role: 'supplier', archetype: 'VOID' },
    { email: 'customer@closetkraze.com', password: 'password123', handle: 'Customer_X', role: 'client', archetype: 'LUXE' }
  ];

  for (const u of demoUsers) {
    try {
      // Check if user already exists in Firestore
      const userQuery = query(collection(db, 'users'), where('email', '==', u.email));
      const userSnapshot = await getDocs(userQuery);
      
      if (userSnapshot.empty) {
        console.log(`Creating demo user: ${u.email}`);
        const userCredential = await createUserWithEmailAndPassword(auth, u.email, u.password);
        const firebaseUser = userCredential.user;
        
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          id: firebaseUser.uid,
          handle: u.handle,
          email: u.email,
          role: u.role,
          archetype: u.archetype,
          rep: 1000,
          level: 1,
          coins: 500,
          gems: 10,
          status: 'ACTIVE',
          lastLogin: new Date().toISOString(),
          totalSpent: 0
        });
      }
    } catch (error) {
      console.error(`Error creating demo user ${u.email}:`, error);
    }
  }

  console.log('Database seeding complete.');
};
