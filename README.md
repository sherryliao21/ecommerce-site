Blanche | Fashion Ecommerce
===

![snap]('/assets/landing-page.png')

Blanche is an ecommerce website where users get to shop latest trends in women's clothing. This project serves both as full-stack and backend API server. Built with Node.js, Express, MySQL, and deployed on Heroku. 

:::info
🚀 Blanche is now live on Heroku, feel free to try it out: https://ecommerce-simple.herokuapp.com/
:::

You can use the default accounts below or register your own account to login:

```
email: root@example.com (Admin) / user2@example.com (User)
password: 12345678
```


## Table of Contents

[TOC]

API Documentation
---
Please refer to this Swagger Documentation: _____

Features
---

### User Storefront

Login (Anyone)
  - Login locally, or via Facebook or Google

Browse fashion items (Users and Visitors)
  - Browse fashion items based on categories.
  - Search items by keyword.

Shopping Cart (Users and Visitors)
  - Add items to their shopping cart.
  - Add or subtract item quantity in their shopping cart.
  - See the total price of items in their shopping cart.

Order (Logged-in Users ONLY)
  - Proceed to checkout from their cart.
  - Browse a list of their orders and perform payment.
  - Cancel a specific order.

Payment
  - Perform payment by visa card.
  - See payment and shipping status in their orders list.

### Admin Control Panel

Manage items and categories (Admin)
  - Browse a list of items and categories.
  - Create, Edit, and Delete an item or category.
  - Search items by keyword.

Manage orders (Admin)
  - Browse a list of orders with  payment and shipping status.
  - Edit payment and shipping status.
  - Cancel a specific order.



Schema ERD
---
 ![ERD](https://i.imgur.com/rwCPq1Q.png)

## Dependencies

[Git](https://git-scm.com/downloads)
[Node.js (v14.15.1 or above)](https://nodejs.org/en/)
[Express](https://expressjs.com/)
[MySQL](https://www.mysql.com/)

Third Party Payment API
---
Blanche uses [NewebPay](https://www.newebpay.com/) as a third-party payment API, now available with a test account.

To get full access of payment testing, double check that you have installed `ngrok` and run `$ ngork http 3000` in your terminal to get a testing url, and pasted it in your .env variables.

1. Keep `ngrok` running
2. Copy the `ngrok url` to your browser address
3. Login and proceed to order payment

You must enter below visa card no. for testing:
```
4000-2211-1111-1111
```
4. Randomly fill in other information required in the NewebPay payment page

Install
---
1. Clone this project to your local machine

```
$ git clone https://github.com/sherryliao21/ecommerce-site.git
```
2. Find the folder and install dependencies

```
$ cd ecommerce-site
$ npm install
```

3. Add a `.env` file to your root directory

:::warning
⚠️ In order to access all features of Blanche, make sure you fill out information listed below 
:::

```
PORT=3000
SESSION_SECRET=
JWT_SECRET=
FACEBOOK_ID=<your_facebook_app_id>
FACEBOOK_SECRET=<your_facebook_app_secret>
FACEBOOK_CALLBACK=http://localhost:3000/auth/facebook/callback
GOOGLE_CALLBACK=http://localhost:3000/auth/google/callback
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
IMGUR_CLIENT_ID=<your_imgur_client_id>
EMAIL_ACCOUNT=<your_test_email_account>
EMAIL_PASSWORD=<your_test_email_password>
URL=http://localhost:3000
MERCHANT_ID=<your_newebpay_merchant_id>
HASH_KEY=<your_newebpay_hash_key>
HASH_IV=<your_newebpay_hash_iv>
PAYMENT_URL=<your_ngrok_url>
```

:::warning
❗ If you want to test newebpay visa card payment locally, make sure you install `ngrok`, run `ngrok http 3000`, and copy the url to `PAYMENT_URL` in .env variables. 
:::

Setting up database
---
1. Enter your MySQL Workbench password in config.json file
```
{
  "development": {
    "username": "root",
    "password": <your_mysql_workbench_password>,
    "database": "ecommerce",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
```

2. Create database in MySQL

:::warning
⚠️ To create database for development, run the following syntax in MySQL Workbench.
:::
```
drop database if exists ecommerce;
create database ecommerce;
```

3. Use Sequelize CLI to create tables in database
```
$ npx sequelize db:migrate
```

4. Run below script to import seed data
```
$ npm run seed
```

Run the application
---
1. If you have installed nodemon, run the following script: `$ npm run dev`. If not, just run: `$ node app.js`

The server will start running on http://localhost:3000/

Contributors
---
[Ivy Hung](https://github.com/ivyhungtw) , [Sherry Liao](https://github.com/sherryliao21)