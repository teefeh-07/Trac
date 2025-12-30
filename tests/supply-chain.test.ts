import {
  clarify,
  tx,
  assertEquals,
  expect,
  test,
} from 'clarity-test';

const contractAddress = 'your_contract_address';

// Smart contract function imports
import {
  registerManufacturer,
  verifyManufacturer,
  createProduct,
  addSupplyChainStep,
  transferProduct,
  processPayment,
  getProductDetails,
  getManufacturer,
  getSupplyChainStep,
} from './your_contract_name.clar';

const manufacturerAddress = 'your_manufacturer_address';
const contractOwnerAddress = 'your_contract_owner_address';
const newHolderAddress = 'new_holder_address';
const buyerAddress = 'buyer_address';

test('Register Manufacturer', async () => {
  const name = 'Test Manufacturer';

  const result = await clarify.call(contractAddress, registerManufacturer(name), manufacturerAddress);
  expect(result).toEqual({ ok: true });

  const manufacturerDetails = await clarify.query(contractAddress, getManufacturer(manufacturerAddress));
  expect(manufacturerDetails).toEqual({ name, verified: false });
});

test('Verify Manufacturer', async () => {
  // Register the manufacturer first
  await clarify.call(contractAddress, registerManufacturer('Test Manufacturer'), manufacturerAddress);

  const result = await clarify.call(contractAddress, verifyManufacturer(manufacturerAddress), contractOwnerAddress);
  expect(result).toEqual({ ok: true });

  const manufacturerDetails = await clarify.query(contractAddress, getManufacturer(manufacturerAddress));
  expect(manufacturerDetails.verified).toEqual(true);
});

test('Create Product', async () => {
  const name = 'Test Product';
  const sustainable = true;
  const price = 1000;

  // Verify the manufacturer first
  await clarify.call(contractAddress, verifyManufacturer(manufacturerAddress), contractOwnerAddress);

  const result = await clarify.call(contractAddress, createProduct(name, sustainable, price), manufacturerAddress);
  expect(result).toMatchObject({ ok: expect.any(Number) }); // Check if it returns a product ID

  const productId = result.ok; // Get the returned product ID
  const productDetails = await clarify.query(contractAddress, getProductDetails(productId));
  expect(productDetails).toEqual({
      manufacturer: manufacturerAddress,
      name,
      status: 'created',
      currentHolder: manufacturerAddress,
      sustainable,
      price,
  });
});

test('Add Supply Chain Step', async () => {
  const productId = 1; // Use the product ID from the create product test
  const stepNumber = 1;
  const location = 'Location A';

  const result = await clarify.call(contractAddress, addSupplyChainStep(productId, stepNumber, location), manufacturerAddress);
  expect(result).toEqual({ ok: true });

  const stepDetails = await clarify.query(contractAddress, getSupplyChainStep(productId, stepNumber));
  expect(stepDetails).toEqual({
      handler: manufacturerAddress,
      location,
      verified: false,
  });
});

test('Transfer Product', async () => {
  const productId = 1; // Use the product ID from the create product test

  const result = await clarify.call(contractAddress, transferProduct(productId, newHolderAddress), manufacturerAddress);
  expect(result).toEqual({ ok: true });

  const productDetails = await clarify.query(contractAddress, getProductDetails(productId));
  expect(productDetails.currentHolder).toEqual(newHolderAddress);
  expect(productDetails.status).toEqual('transferred');
});

test('Process Payment', async () => {
  const productId = 1; // Use the product ID from the create product test

  // Simulate the payment process
  const result = await clarify.call(contractAddress, processPayment(productId), buyerAddress);
  expect(result).toEqual({ ok: true });

  const productDetails = await clarify.query(contractAddress, getProductDetails(productId));
  expect(productDetails.status).toEqual('paid');
});
