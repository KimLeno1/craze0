export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding via SQL API...');
    const response = await fetch('/api/admin/seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.success) {
      console.log('Database seeding complete:', data.message);
    } else {
      console.error('Database seeding failed:', data.error);
    }
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
};
