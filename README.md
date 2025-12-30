# **Trackr: Decentralized Supply Chain Management System**

**Trackr** is a decentralized supply chain management system built on blockchain technology using Clarity smart contracts. It allows for transparent and secure tracking of products from the manufacturer to the consumer, incorporating automated verification, payment processing, and sustainability checks. The project empowers manufacturers, supply chain handlers, and consumers with a tamper-proof system for product tracking and authentication.

## **Key Features**
- **Product Tracking**: Trace the lifecycle of products from manufacturing to consumer delivery.
- **Automated Verification**: Steps in the supply chain are verified automatically at every checkpoint.
- **Payment Processing**: Enables secure, automated payments to manufacturers once products are delivered.
- **Sustainability Verification**: Track and verify the sustainability of products throughout the supply chain.
- **Manufacturer Registration**: Verified manufacturers can create and manage products.
- **Supply Chain Steps**: Easily add and verify steps in the supply chain, ensuring transparency at each stage.

## **Project Structure**
### Smart Contracts
The core of Trackr is written in Clarity, a secure language for smart contracts. The contract consists of the following modules:
- **Manufacturer Management**: Register and verify manufacturers.
- **Product Management**: Create products and track their progress in the supply chain.
- **Supply Chain Tracking**: Add steps in the supply chain and monitor product movement.
- **Payment Processing**: Handle payments from consumers to manufacturers.
- **Sustainability Verification**: Check the sustainability status of a product at any point.

### Data Structures
- **Manufacturers**: Registered manufacturers who create products.
- **Products**: The items being tracked, with details such as manufacturer, current holder, status, and price.
- **Supply Chain Steps**: Each step in the supply chain, recording the handler, location, and timestamp.

## **Smart Contract Functions**
### **Read-Only Functions**
- **`get-product-details (product-id uint)`**: Retrieve details about a specific product.
- **`get-manufacturer (address principal)`**: Fetch details about a registered manufacturer.
- **`get-supply-chain-step (product-id uint, step-number uint)`**: Retrieve details of a particular supply chain step for a product.
- **`verify-sustainability (product-id uint)`**: Check if a product is marked as sustainable.

### **Public Functions**
- **`register-manufacturer (name string)`**: Register a new manufacturer on the platform.
- **`verify-manufacturer (manufacturer principal)`**: Contract owner verifies a manufacturer.
- **`create-product (name string, sustainable bool, price uint)`**: Create a new product with specified details.
- **`add-supply-chain-step (product-id uint, step-number uint, location string)`**: Add a step to the supply chain.
- **`transfer-product (product-id uint, recipient principal)`**: Transfer product ownership to a new holder.
- **`process-payment (product-id uint)`**: Process payment for a product after delivery.

### **Helper Functions (Private)**
- **`get-current-holder (product)`**: Get the current holder of a product.
- **`get-price (product)`**: Retrieve the price of a product.
- **`get-manufacturer-from-product (product)`**: Get the manufacturer of a product.
- **`get-verified (manufacturer-data)`**: Check if a manufacturer is verified.
- **`get-sustainable (product)`**: Retrieve the sustainability status of a product.

## **Setup and Deployment**
To deploy the **Trackr** smart contract:

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/trackr.git
    cd trackr
    ```

2. Install dependencies (Clarinet for smart contract deployment):
    ```bash
    npm install -g @blockstack/clarinet
    ```

3. Test the contract locally:
    ```bash
    clarinet test
    ```

4. Deploy the contract to your local environment or on the Stacks blockchain:
    ```bash
    clarinet deploy
    ```

## **Usage**
Once the contract is deployed, use the following functions to interact with the system:

- **Register a Manufacturer**:
    ```cl
    (register-manufacturer "CompanyName")
    ```

- **Verify a Manufacturer** (only contract owner):
    ```cl
    (verify-manufacturer tx-sender)
    ```

- **Create a Product**:
    ```cl
    (create-product "ProductName" true u5000) ;; Sustainable product priced at 5000 STX
    ```

- **Add a Supply Chain Step**:
    ```cl
    (add-supply-chain-step u1 u1 "Factory Location")
    ```

- **Transfer a Product**:
    ```cl
    (transfer-product u1 'SP2C2MD...)
    ```

- **Process Payment**:
    ```cl
    (process-payment u1)
    ```

- **Verify Sustainability**:
    ```cl
    (verify-sustainability u1)
    ```

## **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## **Contributing**
Contributions to **Trackr** are welcome! If you'd like to contribute, please fork the repository, make your changes, and submit a pull request. For major changes, please open an issue first to discuss your ideas.

---

**Trackr** offers a robust, decentralized way to manage and track products in a supply chain. It leverages blockchain technology to ensure transparency, security, and automation in every step of product management and tracking. Whether you’re a manufacturer, supply chain handler, or consumer, Trackr empowers you to trust the journey of the products you use.

