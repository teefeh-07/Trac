;; Decentralized Supply Chain Management System
;; Tracks products from manufacturer to consumer with automated verification and payments.

;; Constants
(define-constant contract-owner tx-sender) ;; The contract owner, initialized as the transaction sender.
(define-constant err-owner-only (err u100)) ;; Error thrown when a non-owner tries to perform owner-only actions.
(define-constant err-not-manufacturer (err u101)) ;; Error thrown when a non-manufacturer tries to create a product.
(define-constant err-invalid-product (err u102)) ;; Error thrown when an invalid product ID is referenced.
(define-constant err-invalid-status (err u103)) ;; Error thrown for invalid status updates on products.
(define-constant err-unauthorized (err u104)) ;; Error thrown when the user lacks permission for an action.
(define-constant err-already-exists (err u105)) ;; Error thrown when a manufacturer is already registered.

;; Data Variable
(define-data-var last-product-id uint u0) ;; Tracks the last used product ID.

;; Data Structures
(define-map manufacturers 
    principal 
    { name: (string-ascii 50), verified: bool }) ;; Maps manufacturer addresses to their name and verified status.

(define-map products 
    uint 
    { 
        manufacturer: principal, ;; The manufacturer's principal (address).
        name: (string-ascii 50), ;; Product name (ASCII string, max length 50).
        status: (string-ascii 20), ;; Current status of the product (e.g., "created", "transferred").
        current-holder: principal, ;; The current holder of the product.
        timestamp: uint, ;; The timestamp (block height) of the last update.
        sustainable: bool, ;; Whether the product is marked as sustainable.
        price: uint ;; The price of the product in micro-STX (1 STX = 1,000,000 micro-STX).
    })

(define-map supply-chain-steps
    { product-id: uint, step-number: uint }
    {
        handler: principal, ;; The address of the party handling the product at this step.
        location: (string-ascii 50), ;; The location of the product at this step.
        timestamp: uint, ;; The timestamp (block height) of this step.
        verified: bool ;; Whether the step has been verified (e.g., by authorities).
    })

;; Read-Only Functions (Used to Retrieve Data)

(define-read-only (get-product-details (product-id uint))
    ;; Retrieves the details of a product by its ID.
    (map-get? products product-id))

(define-read-only (get-manufacturer (address principal))
    ;; Retrieves the manufacturer details for a given address.
    (map-get? manufacturers address))

(define-read-only (get-supply-chain-step (product-id uint) (step-number uint))
    ;; Retrieves a specific step in the supply chain for a given product.
    (map-get? supply-chain-steps { product-id: product-id, step-number: step-number }))

;; Manufacturer Management Functions

(define-public (register-manufacturer (name (string-ascii 50)))
    ;; Registers a new manufacturer. Ensures the manufacturer is not already registered.
    (begin
        (asserts! (is-none (get-manufacturer tx-sender)) err-already-exists)
        (map-set manufacturers 
            tx-sender 
            { name: name, verified: false }) ;; Initially, the manufacturer is not verified.
        (ok true)))

(define-public (verify-manufacturer (manufacturer principal))
    ;; Verifies a manufacturer, marking them as legitimate.
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only) ;; Only the contract owner can verify.
        (map-set manufacturers 
            manufacturer 
            (merge (unwrap! (get-manufacturer manufacturer) err-invalid-product)
                  { verified: true })) ;; Update the verified status to true.
        (ok true)))

;; Product Management Functions

(define-public (create-product 
    (name (string-ascii 50))
    (sustainable bool)
    (price uint))
    ;; Creates a new product associated with the manufacturer. Only verified manufacturers can create products.
    (let (
        (manufacturer-data (unwrap! (get-manufacturer tx-sender) err-not-manufacturer))
        (product-id (+ (var-get last-product-id) u1)) ;; Increment the last used product ID.
        )
        (asserts! (get-verified manufacturer-data) err-unauthorized) ;; Ensure the manufacturer is verified.
        (map-set products product-id
            {
                manufacturer: tx-sender,
                name: name,
                status: "created", ;; Initial status is "created".
                current-holder: tx-sender,
                timestamp: block-height, ;; Current block height as timestamp.
                sustainable: sustainable,
                price: price
            })
        (var-set last-product-id product-id) ;; Update the last product ID.
        (ok product-id)))

;; Supply Chain Tracking Functions

(define-public (add-supply-chain-step 
    (product-id uint)
    (step-number uint)
    (location (string-ascii 50)))
    ;; Adds a new step in the supply chain for the given product.
    (let ((product (unwrap! (get-product-details product-id) err-invalid-product)))
        (asserts! (is-eq (get-current-holder product) tx-sender) err-unauthorized) ;; Only the current holder can update the product's status.
        (map-set supply-chain-steps
            { product-id: product-id, step-number: step-number }
            {
                handler: tx-sender,
                location: location,
                timestamp: block-height,
                verified: false ;; Initially, the step is unverified.
            })
        (ok true)))

;; Transfer and Payment Functions

(define-public (transfer-product 
    (product-id uint)
    (recipient principal))
    ;; Transfers ownership of the product to a new holder.
    (let ((product (unwrap! (get-product-details product-id) err-invalid-product)))
        (asserts! (is-eq (get-current-holder product) tx-sender) err-unauthorized) ;; Only the current holder can transfer.
        (map-set products product-id
            (merge product {
                current-holder: recipient, ;; Update the current holder to the recipient.
                status: "transferred", ;; Update status to "transferred".
                timestamp: block-height
            }))
        (ok true)))

(define-public (process-payment 
    (product-id uint))
    ;; Processes payment for the product. The buyer pays the manufacturer.
    (let ((product (unwrap! (get-product-details product-id) err-invalid-product)))
        (try! (stx-transfer? 
            (get-price product) ;; Transfer the product price in STX.
            tx-sender
            (get-manufacturer-from-product product)))
        (map-set products product-id
            (merge product {
                status: "paid", ;; Update status to "paid".
                timestamp: block-height
            }))
        (ok true)))

;; Sustainability Verification Functions

(define-read-only (verify-sustainability (product-id uint))
    ;; Checks if a product is marked as sustainable.
    (match (get-product-details product-id)
        product (ok (get-sustainable product))
        err-invalid-product))

;; Helper Functions for Data Access

(define-private (get-current-holder (product {
        manufacturer: principal,
        name: (string-ascii 50),
        status: (string-ascii 20),
        current-holder: principal,
        timestamp: uint,
        sustainable: bool,
        price: uint
    }))
    ;; Returns the current holder of the product.
    (get current-holder product))

(define-private (get-price (product {
        manufacturer: principal,
        name: (string-ascii 50),
        status: (string-ascii 20),
        current-holder: principal,
        timestamp: uint,
        sustainable: bool,
        price: uint
    }))
    ;; Returns the price of the product.
    (get price product))

(define-private (get-manufacturer-from-product (product {
        manufacturer: principal,
        name: (string-ascii 50),
        status: (string-ascii 20),
        current-holder: principal,
        timestamp: uint,
        sustainable: bool,
        price: uint
    }))
    ;; Returns the manufacturer of the product.
    (get manufacturer product))

(define-private (get-verified (manufacturer-data {
        name: (string-ascii 50),
        verified: bool
    }))
    ;; Returns whether the manufacturer is verified.
    (get verified manufacturer-data))

(define-private (get-sustainable (product {
        manufacturer: principal,
        name: (string-ascii 50),
        status: (string-ascii 20),
        current-holder: principal,
        timestamp: uint,
        sustainable: bool,
        price: uint
    }))
    ;; Returns whether the product is marked as sustainable.
    (get sustainable product))
