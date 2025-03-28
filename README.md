
---

# **Wish List** 
*A full-stack Node.js application with authentication, authorization, persistent storage, and automated CI/CD deployment.*

## **Overview**  
This project is a **simple yet robust wish list management application** built using **Node.js, Express, EJS, SQLite3, and Render**. It enables users to **register, log in, add, edit, delete, and view wish list items**.  

The app follows **best security practices** (e.g., password hashing, session management) and features an **automated deployment pipeline** via **GitHub Actions & Render**.

---

## **Tech Stack**
| Technology | Purpose |
|------------|---------|
| **Node.js (Express.js)** | Backend framework |
| **EJS** | Templating engine for rendering views |
| **SQLite3** | Lightweight, persistent database |
| **CSS** | Styling for UI |
| **Render** | Cloud platform for hosting |
| **GitHub Actions** | CI/CD pipeline for automated testing & deployment |

---

## **Features**
✔️ **User Authentication & Authorization** (Register/Login/Logout)  
✔️ **Persistent SQLite3 Database** (Stores users & wish list items)  
✔️ **CRUD Operations** (Add, Edit, Delete wish list items)  
✔️ **Server-Side Rendering with EJS**  
✔️ **Security Measures** (Hashed passwords, protected routes)  
✔️ **Automated Testing & Deployment with GitHub Actions**  

---

## **Live Demo**
**[Try the Live App](https://wish-list-h9fe.onrender.com)**



---

## **Project Structure**
```
wish-list/
├── app.js               # Main application file
├── fetchCookie.js       # Utility for handling session cookies
├── package.json         # Project metadata & dependencies
├── public/
│   └── styles.css       # CSS styles
├── testing/
│   └── smoke-test.sh    # Smoke test script for CI/CD
├── views/
│   ├── add.ejs          # Add wish list item
│   ├── index.ejs        # Homepage (dashboard)
│   ├── login.ejs        # User login page
│   ├── register.ejs     # User registration page
│   └── update.ejs       # Update wish list item
└── .github/
    └── workflows/
        └── deploy.yml   # GitHub Actions workflow for CI/CD
```

---

## **Getting Started**

### **Clone the Repository**
```sh
git clone https://github.com/skravco/wish-list.git
cd wish-list
```

### **Install Dependencies**
```sh
npm install
```

### **Run the Application**
```sh
node app.js
```
or use `nodemon` for development:
```sh
npx nodemon app.js
```
Your app should now be running at **`http://localhost:3000`**. 🎉

---

## **Authentication & Security**
- **Passwords are securely hashed** using `bcrypt`
- **Sessions managed via `express-session`** for persistent login
- **Routes are protected** (Only authenticated users can manage wish lists)

---

## **Testing**
A **smoke test script** is included in `testing/smoke-test.sh`, which runs basic tests for authentication and wish list functionality.

Run it manually:
```sh
bash testing/smoke-test.sh
```

✅ Automated tests run before every deployment via **GitHub Actions**.

---

## **CI/CD & Deployment**
### **Automated Deployment on Render**
This project uses **GitHub Actions** for automated **testing & deployment**.  

#### **CI/CD Workflow:**
1. **On every `git push` to `master`**:
   - The app is **tested** using `smoke-test.sh`
   - If all tests pass, **deployment is triggered automatically**

2. **Deployment uses Render API**:
   - Render fetches the latest version & restarts the service

---

## **Why This Project Stands Out**
This project is more than just a CRUD app—it's designed with **real-world software engineering principles**, including:  
✔️ **Authentication & Security Best Practices**  
✔️ **Persistent Data Storage with SQLite**  
✔️ **CI/CD with GitHub Actions & Automated Deployments**  
✔️ **Scalability & Cloud Deployment on Render**  

> **This showcases my ability to build, test, and deploy modern web applications in a professional environment.**  

---

## **Future Enhancements**
- ✅ Migrate from SQLite3 to PostgreSQL for scalability  
- ✅ Implement OAuth (Google Login) for easier authentication  

---
  
## **Contact & Links**
 **Portfolio**: [skravco.github.io](https://skravco.github.io/)
 **LinkedIn**: [skravco](https://www.linkedin.com/in/skravco)

---

### **If you found this insightful useful, please give it a star!** 
---