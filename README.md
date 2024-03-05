# Overview

![icon-192x192](https://github.com/tylerhkmontana/infinite-order/assets/63427616/4a47b431-ba98-42c2-af1e-734914152349)

### WELCOME TO INFINITE ORDER

Online order pad that does everything a paper order pad does paperlessly in an intutively designed user interface and more things that only a digital solution can offer. A business owner can create a customized order pad for the business and the servers can download the order pad to their mobile device simply through an unique id of the order pad. With `Infinite Order`, you don't need to squeeze your writtings into a small pocket-size paper and don't need to flip through pages to keep a track of each table and get confused. 

Take the full control over your table management and deliver a perfect dining service!

[You can access the website here!](https://infinite-order.vercel.app/)


# Built with
[![next js logo](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![react logo](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![sass logo](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![sass logo](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

# Order Pad Architecture
An order pad has mainly three components, `Category`, `Allergen`, and `Item`. A `category` is different section of a menu such as **appetizers**, **entrées**, **desserts**, and **drinks**. Each `category` consists of `items` that fall under the same category. For example, a category, `"appetizers"`, can possibly contain items like **french fries**, **nachos**, **guacamole**, and **spinach dips**. An `allergen` is an ingredient that an `item` contain that can possibly be an allergen to a customer. You can create a list of allergens and select them when you create an item when the allergens are included in the item.

# Usage

When you access the main page of the website there are two main routes you can access, which are `management` and `server`. Simply put, in the `management` route you can create and modify an order pad for your business, and a server at your business can download the order pad from `sever` route and use it. 

![chrome-capture](https://github.com/tylerhkmontana/infinite-order/assets/63427616/40f70478-d1cc-43a7-b8ae-78d623725451)


## I. Management Page
This is where you create and manage an order pad for your business

### 1. Login 
You can login with your google account 

![chrome-capture (1)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/7495e15e-9878-4cd3-968d-48f8b2a08b7f)

### 2. Initialize
If you have not created your order pad, you can initialize one with your business name.

![chrome-capture-2024-2-29 (1)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/32e5412a-75be-467b-9539-17bf58006718)

### 3. How to update your order pad

#### a. Allergens and Category
You can add a list of allergens you want to update, and if you click update, your order pad is permanatly updated.

![chrome-capture-2024-2-29 (2)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/96c583ca-bee7-41ae-9745-a89db862cc68)

You can update category in the same manner. As you can see below, when you update category, they appear in the section where you update items.

![chrome-capture-2024-2-29 (3)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/074e5b39-e2f0-416c-8595-67bd72d7cf2e)


#### b. Items
First, you select the category that you want to create an item within, and fill out the information of the item.

![chrome-capture-2024-2-29 (5)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/4c0b6d4e-3891-4859-8b0c-d8f2987fc307)

**button color** is the color for the item that will appear on order pad. You can sub-categorize the item under the same category with a specific color based on such factor like how it is cooked (fried or steamed).

Select any **allergen** that the item contains

**option** is used for additional charge or special request where a customer ocassionally makes (Of course, you additional $1 for a ketch is a madness).

![chrome-capture-2024-2-29 (6)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/b0fb0bec-1352-4496-bbdd-039a1e8e5a38)

#### c. Order of items in the category
Sometimes, you want the items to be in a specific order for efficiency, then you can re-organize the order of items from `Order of Item` section.

![chrome-capture-2024-2-29 (8)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/6f8cf288-54cc-4326-87c8-c7f09a225c62)

### 4. Delete the current order pad
You can delete the order pad and create a new one. Be cautious that deleting order pad will remove all the information you had associated with the previous order pad.

![chrome-capture-2024-2-29 (9)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/41d1c247-fb50-4042-8ba9-89c05123186f)

## II. Server Page
This is where a server downloads the order pad from a unique id of the order pad, and manage orders during the dining service.

### 1. Download the order pad
A server can download the order pad by typing in the unique id of the order pad provided the management. 

![chrome-capture-2024-3-1](https://github.com/tylerhkmontana/infinite-order/assets/63427616/bdef9623-6aa6-45bc-b1a8-b6d28a262b2b)

### 2. Order Pad
This is an overview of the order pad that a server will be utilizing. On the `order pad` page you can access the menu in POS style, and on the `orders` page you can manage each table you are currently serving. 

![chrome-capture-2024-3-1 (1)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/0a4ffbea-501e-40d5-834c-420294a8cb41)

### 3. Managing Orders
You can create a virtual table for each table you are serving in `orders` page and can manage your orders for the table from there. 

#### a. Create a table
Normally, a server is assigned with numbers of tables to manage before the service, and each table has its unique table number. When yhou create a virtual table for the table you wait, you can assign the table number and number of customer at the table.

![chrome-capture-2024-3-1 (2)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/7975f8ab-b0bb-4fe0-b862-bda7a0d5f3b6)

#### b. Table details
After a server interacting with a party, the server can make a note of any special request, occasion, or allergies that require attention during the dining service. If the table has any allergies and the server makes a note inside the virtual table, any item that includes a specific allergen will be indicated so. 

![chrome-capture-2024-3-1 (3)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/5c94c67b-efe4-47f9-8c13-a0ea4657d6e2)
![chrome-capture-2024-3-1 (4)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/3056fa53-b790-47f2-97d5-800e7404503f)

#### c. Taking an order
When a server takes an order from a party, he or she can click the specific item that the customer wants to order in the similar manner as POS instead of writing it down, and numbers of item can be modified with '+' or '-' button, or can be removed with 'x' button. After taking an order is completed, the server can click 'place order' button to confrim the order, and have a record inside the virtual table to keep a track later.

![chrome-capture-2024-3-1 (5)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/bdf02a0e-5db3-4594-9aaa-e912ea250886)
![chrome-capture-2024-3-1 (6)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/19c92b30-1c2f-4df5-8d62-cb6a79bb8a62)

#### d. Table status
A server is normally responsible for the food delivery from the kitchen to the customers' tables, and if anything is missing, he or she should resolve the issue. Table status shows what items the table ordered, and the server can keep a track of them. If the server confirms that a specific food is served to the table, then he or she can click 'waiting...' button to change its status to 'delivered'

![chrome-capture-2024-3-1 (7)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/92ef6340-968d-435d-af0f-68b567b7f857)

#### e. Delete or clear tables
A server can delete a table with 'delete' button or remove all the tables with 'clear tables' button.

![chrome-capture-2024-3-1 (11)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/b8b669f3-83a9-47fa-9de1-fba5ffbcedb9)

### 4. Update or reset order pad
Whenever the restaurant has an update over their menu, a server can click 'update' button to update their order pad, or get a new order pad by clicking 'reset' button and download a new order pad.

![chrome-capture-2024-3-1 (9)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/1c6f2451-7170-4dd5-87a4-3d0564cebbae)
![chrome-capture-2024-3-1 (10)](https://github.com/tylerhkmontana/infinite-order/assets/63427616/e6711bda-2fcf-4409-8044-ebf4b84c9e4d)






