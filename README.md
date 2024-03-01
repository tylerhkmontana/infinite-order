# Infinite Order

![icon-192x192](https://github.com/tylerhkmontana/infinite-order/assets/63427616/4a47b431-ba98-42c2-af1e-734914152349)


Online order pad that does everything a paper order pad does paperlessly in an intutively designed user interface and more things that only a digital solution can offer. A business owner can create a customized order pad for the business and the servers can download the order pad to their mobile device simply through an unique id of the order pad. With `Infinite Order`, you don't need to squeeze your writtings into a small pocket-size paper and don't need to flip through pages to keep a track of each table and get confused. 

Take the full control over your table management and deliver a perfect dining service!

[You can access the website here!](https://infinite-order.vercel.app/)


## Built with
[![next js logo](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![react logo](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![sass logo](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![sass logo](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

## Order Pad Architecture
An order pad has mainly three components, `Category`, `Allergen`, and `Item`. A `category` is different section of a menu such as **appetizers**, **entrées**, **desserts**, and **drinks**. Each `category` consists of `items` that fall under the same category. For example, a category, `"appetizers"`, can possibly contain items like **french fries**, **nachos**, **guacamole**, and **spinach dips**. An `allergen` is an ingredient that an `item` contain that can possibly be an allergen to a customer. You can create a list of allergens and select them when you create an item when the allergens are included in the item.

## Usage

When you access the main page of the website there are two main routes you can access, which are `management` and `server`. Simply put, in the `management` route you can create and modify an order pad for your business, and a server at your business can download the order pad from `sever` route and use it. 
![chrome-capture](https://github.com/tylerhkmontana/infinite-order/assets/63427616/40f70478-d1cc-43a7-b8ae-78d623725451)


### I. Management Page
This is where you create and manage an order pad for your business

#### 1. Login 
You can login with your google account 
![chrome-capture (1)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/7495e15e-9878-4cd3-968d-48f8b2a08b7f)

#### 2. Initialize
If you have not created your order pad, you can initialize one with your business name.
![chrome-capture-2024-2-29 (1)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/32e5412a-75be-467b-9539-17bf58006718)

#### 3. How to update your order pad
##### a. Allergens and Category
##### b. Items
##### c. Order of items in the category

#### 4. Delete the current order

### II. Server Page
This is where a server downloads the order pad from a unique id of the order pad, and manage orders during the dining service.

#### 1. Download the order pad
#### 2. Order Pad
#### 3. Managing Orders
##### a. Create a table
##### b. Table specification
##### c. Taking an order
##### d. Table status
##### e. Delete or clear tables
#### 4. Update or reset order pad






