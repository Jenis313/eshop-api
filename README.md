
<h3 align="center">ESHOP Api</h3>

<p align="center"> Small ecommerce api created with Node and express.js.
    <br> 
</p>

## 📝 Table of Contents
- [About](#about)
- [Getting Started](#getting_started)
- [Built Using](#built_using)
- [TODO](#todo)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>
This is a simple ecommerce api which allows users to register their profile, add different ecommerce products and do all sorts of CRUD things. As it is created as a learning project it may have some issues and vulnerabilities. It is not complete yet 
## 🏁 Getting Started <a name = "getting_started"></a>
To run this project on your machine
- git clone https://github.com/Jenis313/eshop-api
- cd eshop-api
- npm install
- rename dbName variable if you want to change database name, and if you like to use different port change PORT variable in app.js

## 🎈 Usage <a name="usage"></a>
To use this web app simply visit the localhost at same port where this app is listening. 
Baseurl : http://localhost:{YOUR_PORT}/api/
Endpoints: 
<b>Auth</b>
-Login : auth/login(POST)
-Register : auth/register(POST)
<b>Users</b>
-Get users : users(GET)
-Delete user : users/{id}(DELETE)
-Update user : users/{id}(PUT)
<b>Product</b>
-Add product: product(POST) - authentication needed
-Fetch all products: product(GET) - authentication needed
-Fetch single products: product/{id}(GET)
-Search all products: product/search(GET)
-Remove product: product/{id}(DELETE) - authentication needed
-Update product: product/{id}(PUT) - authentication needed
-Add review: product/add_review/{id}(POST) - authentication needed

## ⛏️ Built Using <a name = "built_using"></a>
- [Express](https://expressjs.com/) - Server Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

<a href="https://github.com/Jenis313">
  <img src="https://avatars.githubusercontent.com/u/56223784" alt="Jenis Rai" width="100"/>
</a>