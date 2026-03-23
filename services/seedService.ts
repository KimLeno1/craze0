import { databaseService } from './databaseService';
import { EXTENDED_PRODUCTS } from '../mockData';

export const seedDatabase = async () => {
  console.log('Checking database for seeding...');

  try {
    // 1. Seed Products
    const products = await databaseService.getProducts();
    if (products.length === 0) {
      console.log('Seeding products...');
      const seedPromises = EXTENDED_PRODUCTS.map(p => 
        databaseService.saveProduct({
          ...p,
          supplierId: 'sup1',
          shippingFee: 25
        } as any)
      );
      await Promise.all(seedPromises);
    }

    // 2. Seed Suppliers
    const suppliers = await databaseService.getAdminSuppliers();
    if (suppliers.length === 0) {
      console.log('Seeding suppliers...');
      const mockSuppliers = [
        { id: 'sup1', name: 'CyberKnit Industries', contactEmail: 'ops@cyberknit.nt', region: 'Neo Tokyo Central', status: 'ACTIVE', performanceScore: 94, totalRevenueYield: 450000, joinedDate: '2024-01-12' },
        { id: 'sup2', name: 'Void Loom Textiles', contactEmail: 'archive@voidloom.de', region: 'Neo Berlin', status: 'ACTIVE', performanceScore: 82, totalRevenueYield: 280000, joinedDate: '2024-03-05' }
      ];
      for (const s of mockSuppliers) {
        await databaseService.registerSupplier(s as any);
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
        // Check if user already exists
        const user = await databaseService.getUserByEmail(u.email);
        if (!user) {
          console.log(`Creating demo user: ${u.email}`);
          await databaseService.registerUser(u.email, u.password, u.handle, '0000000000', u.archetype);
          // Note: registerUser might need to be updated to handle roles, 
          // but for now we'll just register them.
        }
      } catch (error) {
        console.error(`Error creating demo user ${u.email}:`, error);
      }
    }

    console.log('Database check/seeding complete.');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
};
