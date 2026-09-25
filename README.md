# 🧸 ToyBox – Online Toy E-Commerce Platform

ToyBox is a **web-based e-commerce platform** designed for buying and selling toys online. The platform allows customers to browse and search for toys, view product details, add products to their cart, place orders, make payments, and track their purchases.

The system also provides an **Admin module** for managing products, inventory, customer orders, and payments, providing a structured and user-friendly online shopping experience.

---

## 📌 Features

### 👤 Authentication & User Management

* Customer and Admin registration and login
* Secure user authentication
* Role-based access control
* User profile management
* Separate functionality for Admin and Customer

### 🧸 Product Management

* Browse available toys
* Search toys by name
* Filter toys by category
* View product details
* Manage product stock and availability
* Display product price and description

### 🛒 Cart & Order Management

* Add toys to cart
* Update cart quantity
* Remove products from cart
* Place orders
* View order details
* View order history
* Track order status

### 💳 Payment Management

* Online payment processing
* Payment status management
* Order-based payment handling
* Admin payment monitoring

### 👨‍💼 Admin Module

* Add new toy products
* Update product details
* Delete products
* Manage inventory and stock
* View customer orders
* Manage order status
* Monitor payments

---

## 🛠️ Technology Stack

| Layer           | Technology            |
| --------------- | --------------------- |
| Frontend        | HTML, CSS, JavaScript |
| Styling         | Tailwind CSS          |
| Backend         | Java, Spring Boot     |
| Architecture    | MVC                   |
| Database        | PostgreSQL            |
| ORM             | JPA / Hibernate       |
| Authentication  | JWT                   |
| Build Tool      | Maven                 |
| API Testing     | Postman               |
| Version Control | Git & GitHub          |
| IDE             | Eclipse / VS Code     |

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Customer       │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │      Frontend       │
                    │ HTML / CSS / JS     │
                    │    Tailwind CSS     │
                    └──────────┬──────────┘
                               │
                          REST APIs
                               │
                    ┌──────────▼──────────┐
                    │     Spring Boot     │
                    │      Backend        │
                    │        MVC          │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   JPA / Hibernate   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │     PostgreSQL      │
                    └─────────────────────┘
```

---

## ⚙️ Prerequisites

Make sure the following are installed before running the project:

* **JDK 17 or higher**
* **Maven**
* **PostgreSQL**
* **Git**
* **Eclipse or VS Code**

Check Java:

```bash
java -version
```

Check Maven:

```bash
mvn -version
```

---

## 🗄️ Database Configuration

ToyBox uses **PostgreSQL** as its relational database.

Create the database:

```sql
CREATE DATABASE toybox;
```

Configure the database connection in:

```text
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/toybox
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

---

## 🚀 Build & Run

### 1. Clone the repository

```bash
git clone https://github.com/RiteshGhugarkar022/ToyBox.git
```

### 2. Navigate to the project

```bash
cd ToyBox
```

### 3. Build the project

```bash
mvn clean package
```

### 4. Run the application

```bash
mvn spring-boot:run
```

### 5. Open the application

Open the browser:

```text
http://localhost:8080
```

---

## 🔐 User Roles

ToyBox provides two main roles:

| Role         | Responsibilities                                                        |
| ------------ | ----------------------------------------------------------------------- |
| **Admin**    | Manage products, inventory, orders, and payments                        |
| **Customer** | Browse toys, manage cart, place orders, make payments, and track orders |

---


## 🛒 Shopping Flow

```text
Customer Registration
        ↓
Customer Login
        ↓
Browse Toys
        ↓
Search / Filter Products
        ↓
View Product Details
        ↓
Add to Cart
        ↓
Place Order
        ↓
Make Payment
        ↓
Order Confirmation
        ↓
Track Order
```

---

## 👨‍💼 Admin Flow

```text
Admin Login
     ↓
Admin Dashboard
     ↓
┌──────────────────────┐
│ Manage Products      │
│ Manage Inventory     │
│ View Orders          │
│ Manage Order Status  │
│ Monitor Payments     │
└──────────────────────┘
```

---

## 🧸 Product Management

Administrators can manage the toy catalog by:

* Adding new toys
* Updating toy information
* Updating prices
* Updating stock quantity
* Managing toy categories
* Removing unavailable products

Customers can:

* Browse available toys
* Search by toy name
* Filter by category
* View price and product information
* Check product availability

---

## 🛒 Cart & Order Process

The basic order workflow is:

```text
Select Toy
   ↓
Add to Cart
   ↓
Review Cart
   ↓
Place Order
   ↓
Payment
   ↓
Order Confirmation
   ↓
Order Tracking
```

Customers can view their previous orders and monitor the current status of their purchases.

---

## 💳 Payment Flow

```text
Customer Places Order
        ↓
Order Created
        ↓
Payment Initiated
        ↓
Payment Successful
        ↓
Payment Status Updated
        ↓
Order Confirmed
```

Administrators can monitor payment information associated with customer orders.

---

## 🔐 Security

ToyBox uses **JWT-based authentication** to secure user access.

Security features include:

* JWT-based login authentication
* Role-based authorization
* Protected Admin APIs
* Customer-specific access
* Password protection
* API-level authorization

---

## 🧪 API Testing

The REST APIs can be tested using **Postman**.

Example login request:

```text
POST http://localhost:8080/api/auth/login
```

Example product request:

```text
GET http://localhost:8080/api/toys
```

Example order request:

```text
POST http://localhost:8080/api/orders
```

---

## 🎯 Project Objective

The primary objective of ToyBox is to provide a **centralized online platform for buying and selling toys**, allowing customers to shop conveniently from anywhere while enabling administrators to efficiently manage products, inventory, orders, and payments.


---

## 📄 License

This project is developed for **educational and academic purposes**.
