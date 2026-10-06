import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from './db/database.js';

async function seedDatabase() {
  const db = await getDb();

  await db.run('DELETE FROM ratings');
  await db.run('DELETE FROM stores');
  await db.run('DELETE FROM users');

  const defaultAdminPassword = await bcrypt.hash('Admin@12345', 10);
  const defaultOwnerPassword = await bcrypt.hash('Owner@12345', 10);
  const defaultUserPassword = await bcrypt.hash('User@12345', 10);

  const adminId = uuidv4();
  await db.run(
    `INSERT INTO users (id, name, email, password, address, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      adminId,
      'System Administrator Account',
      'admin@roxiler.com',
      defaultAdminPassword,
      'Roxiler Global Headquarters, 500 Silicon Boulevard, Suite 900',
      'ADMIN',
    ]
  );

  const owner1Id = uuidv4();
  await db.run(
    `INSERT INTO users (id, name, email, password, address, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      owner1Id,
      'Michael Jonathan Vance-Smith',
      'owner.tech@roxiler.com',
      defaultOwnerPassword,
      '102 Innovation Drive, Tech District, Metro City',
      'STORE_OWNER',
    ]
  );

  const owner2Id = uuidv4();
  await db.run(
    `INSERT INTO users (id, name, email, password, address, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      owner2Id,
      'Elizabeth Charlotte Montgomery',
      'owner.books@roxiler.com',
      defaultOwnerPassword,
      '404 Heritage Boulevard, Old Town Arts District',
      'STORE_OWNER',
    ]
  );

  const owner3Id = uuidv4();
  await db.run(
    `INSERT INTO users (id, name, email, password, address, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      owner3Id,
      'Christopher David Kensington',
      'owner.coffee@roxiler.com',
      defaultOwnerPassword,
      '77 Espresso Way, Waterfront Promenade, Metro City',
      'STORE_OWNER',
    ]
  );

  const store1Id = uuidv4();
  await db.run(
    `INSERT INTO stores (id, name, email, address, owner_id)
     VALUES (?, ?, ?, ?, ?)`,
    [
      store1Id,
      'Apex Electronics & Gadgets Hub',
      'contact@apexelectronics.com',
      'Unit 102, Digital Plaza, 102 Innovation Drive',
      owner1Id,
    ]
  );

  const store2Id = uuidv4();
  await db.run(
    `INSERT INTO stores (id, name, email, address, owner_id)
     VALUES (?, ?, ?, ?, ?)`,
    [
      store2Id,
      'Beacon Hill Literary Bookshop',
      'hello@beaconhillbooks.com',
      'Ground Floor, Heritage Corner, 404 Heritage Boulevard',
      owner2Id,
    ]
  );

  const store3Id = uuidv4();
  await db.run(
    `INSERT INTO stores (id, name, email, address, owner_id)
     VALUES (?, ?, ?, ?, ?)`,
    [
      store3Id,
      'Artisan Craft Coffee Roasters',
      'info@artisancoffee.com',
      'Pier 7, Waterfront Promenade, 77 Espresso Way',
      owner3Id,
    ]
  );

  const store4Id = uuidv4();
  await db.run(
    `INSERT INTO stores (id, name, email, address, owner_id)
     VALUES (?, ?, ?, ?, ?)`,
    [
      store4Id,
      'Urban Fresh Organic Supermart',
      'support@urbanfreshmart.com',
      '880 Central Parkway, Greenway Commercial Complex',
      null,
    ]
  );

  const user1Id = uuidv4();
  await db.run(
    `INSERT INTO users (id, name, email, password, address, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      user1Id,
      'Alexander Montgomery Harrison',
      'user1@roxiler.com',
      defaultUserPassword,
      '12 Maple Leaf Avenue, Apartment 4B, North Hills',
      'USER',
    ]
  );

  const user2Id = uuidv4();
  await db.run(
    `INSERT INTO users (id, name, email, password, address, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      user2Id,
      'Sophia Isabella Worthington',
      'user2@roxiler.com',
      defaultUserPassword,
      '89 Oakridge Terrace, Building 12, Westlake District',
      'USER',
    ]
  );

  const user3Id = uuidv4();
  await db.run(
    `INSERT INTO users (id, name, email, password, address, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      user3Id,
      'Benjamin Zachary Harrington',
      'user3@roxiler.com',
      defaultUserPassword,
      '342 Pinecrest Lane, Garden View Community',
      'USER',
    ]
  );

  await db.run(
    `INSERT INTO ratings (id, user_id, store_id, rating) VALUES (?, ?, ?, ?)`,
    [uuidv4(), user1Id, store1Id, 5]
  );
  await db.run(
    `INSERT INTO ratings (id, user_id, store_id, rating) VALUES (?, ?, ?, ?)`,
    [uuidv4(), user1Id, store2Id, 4]
  );
  await db.run(
    `INSERT INTO ratings (id, user_id, store_id, rating) VALUES (?, ?, ?, ?)`,
    [uuidv4(), user1Id, store3Id, 5]
  );

  await db.run(
    `INSERT INTO ratings (id, user_id, store_id, rating) VALUES (?, ?, ?, ?)`,
    [uuidv4(), user2Id, store1Id, 4]
  );
  await db.run(
    `INSERT INTO ratings (id, user_id, store_id, rating) VALUES (?, ?, ?, ?)`,
    [uuidv4(), user2Id, store2Id, 5]
  );
  await db.run(
    `INSERT INTO ratings (id, user_id, store_id, rating) VALUES (?, ?, ?, ?)`,
    [uuidv4(), user2Id, store3Id, 4]
  );
  await db.run(
    `INSERT INTO ratings (id, user_id, store_id, rating) VALUES (?, ?, ?, ?)`,
    [uuidv4(), user2Id, store4Id, 3]
  );

  await db.run(
    `INSERT INTO ratings (id, user_id, store_id, rating) VALUES (?, ?, ?, ?)`,
    [uuidv4(), user3Id, store1Id, 5]
  );
  await db.run(
    `INSERT INTO ratings (id, user_id, store_id, rating) VALUES (?, ?, ?, ?)`,
    [uuidv4(), user3Id, store3Id, 5]
  );
  await db.run(
    `INSERT INTO ratings (id, user_id, store_id, rating) VALUES (?, ?, ?, ?)`,
    [uuidv4(), user3Id, store4Id, 4]
  );

  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error(err);
  process.exit(1);
});
