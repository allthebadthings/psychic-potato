const BASE_URL = 'http://localhost:3000/api/admin';
const TOKEN = 'dev-admin-token';

async function run() {
  const headers = {
    'x-admin-token': TOKEN,
    'Content-Type': 'application/json'
  };

  console.log('1. List products (Initial)');
  let res = await fetch(`${BASE_URL}/products`, { headers });
  let data = await res.json();
  console.log('Status:', res.status);
  console.log('Data:', JSON.stringify(data, null, 2));

  console.log('\n2. Add a product');
  res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: 'Test Ring', price: 100, stock: 5 })
  });
  const newProduct = await res.json();
  console.log('Status:', res.status);
  console.log('Created:', newProduct);

  if (!newProduct.id) {
    console.error('Failed to create product');
    return;
  }

  console.log('\n3. List products (After Addition)');
  res = await fetch(`${BASE_URL}/products`, { headers });
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Data:', JSON.stringify(data, null, 2));

  console.log(`\n4. Update product (ID: ${newProduct.id})`);
  res = await fetch(`${BASE_URL}/products/${newProduct.id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ price: 150 })
  });
  const updatedProduct = await res.json();
  console.log('Status:', res.status);
  console.log('Updated:', updatedProduct);

  console.log('\n5. List products (After Update)');
  res = await fetch(`${BASE_URL}/products`, { headers });
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Data:', JSON.stringify(data, null, 2));
  
  console.log(`\n6. Delete product (ID: ${newProduct.id})`);
  res = await fetch(`${BASE_URL}/products/${newProduct.id}`, {
    method: 'DELETE',
    headers
  });
  const deleteResult = await res.json();
  console.log('Status:', res.status);
  console.log('Result:', deleteResult);
  
  console.log('\n7. List products (After Delete)');
  res = await fetch(`${BASE_URL}/products`, { headers });
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Data:', JSON.stringify(data, null, 2));
}

run().catch(console.error);
