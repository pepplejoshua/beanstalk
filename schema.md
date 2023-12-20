A user log on as:

- a business user
- a customer

A business user can:

- access dashboard to CRUD products
- manage business profile / inventory / orders

A customer can:

- browse products in the marketplace
- add products to cart
- checkout products in cart and pay (via Stripe if possible)

## User Stories[]: # Path: schema.md

- As a business user, I want to be able to log in to my account (as a business user or a customer).
- As a business user, I want to be able to log out of my account.
- As a business user, I want to be able to create a new product.
- As a business user, I want to be able to edit a product.
- As a business user, I want to be able to delete a product.
- As a business user, I want to be able to view all my products.
- As a business user, I want to be able to view all my orders.
- As a business user, I want to be able to view all my customers.
- As a business user, I want to be able to view all my business information.
- As a business user, I want to be able to edit my business information.
- As a business user, I want to be able to view all my inventory.
- As a business user, I want to be able to edit my inventory.

- As a customer, I want to be able to log in to my account.
- As a customer, I want to be able to log out of my account.
- As a customer, I want to be able to view all products.
- As a customer, I want to be able to add a product to my cart.
- As a customer, I want to be able to view my cart.
- As a customer, I want to be able to edit my cart.
- As a customer, I want to be able to delete a product from my cart.
- As a customer, I want to be able to checkout my cart.
- As a customer, I want to be able to view all my orders.
- As a customer, I want to be able to view all my information.
- As a customer, I want to be able to edit my information.
- As a customer, I want to be able to delete my account.

DB Schema:

```go
User {
    id int
    email string
    first_name string
    last_name string
    password string
    is_business_user bool
    active_business_user bool
    related_business Business
    created_at time
    updated_at time
}

Business {
    id int
    created_by User
    name string
    address string
    phone string
    email string
    created_at time
    updated_at time
}

Product {
    id int
    created_by User
    owned_by Business
    name string
    desc string
    sale_price float
    purchase_price float
    created_at time
    updated_at time
    available_quantity int
}

Inventory {
    id int
    product Product
    business Business
    created_at time
    updated_at time
}

enum OrderFulfilmentMethod {
    PICKUP
    DELIVERY
}

OrderItem {
    id int
    product Product
    quantity int
    created_at time
    updated_at time
}

Order {
    id int
    created_by User
    business Business
    items []OrderItem
    total float
    fulfilment_method OrderFulfilmentMethod
    created_at time
    updated_at time
}

Cart {
    id int
    created_by User
    items []OrderItem
    total float
    created_at time
    updated_at time
}

enum PaymentMethod {
    CASH
    CREDIT_CARD
    DEBIT_CARD
    ONLINE_STRIPE
}

Payment {
    id int
    created_by User
    order Order
    method PaymentMethod
    amount float
    created_at time
    updated_at time
}
```
