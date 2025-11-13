🎓 # Insight_Ledger_PWA

![Dashboard](https://github.com/pooja2006git/Insight_Ledger_PWA/blob/main/images/img1.jpeg?raw=true)


## 🌐 Deployment Link  
🔗 [https://your-netlify-link-here.netlify.app](#)

---

## 📚 Table of Contents

- [Overview](#overview)
- [Project Description](#project-description)
- [ Security & Authentication ](#Security-&-Authentication)
- [Features](#features)
- [How It Works](#how-it-works)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [ Future Enhancements](#Future-Enhancements)

---

## Overview

**Insight Ledger** is an authorized **bank transaction management app** that simplifies how users view and manage their financial transactions.  

Inspired by the traditional bank passbook, it acts as a **digital, secure, and intelligent** version of one — giving users a single place to view, filter, and track all income and expenses interactively.  

The app ensures **data privacy**, **smooth performance**, and **modern UI design**, making finance management effortless and secure.


---

## Project Description

In everyday life, people make numerous financial transactions — paying bills, receiving salaries, or transferring funds. Maintaining and checking all of these manually in a passbook can be exhausting.  

**Insight Ledger** automates this process by creating a digital version of the passbook. Once registered, users can:

- View all transactions in a single dashboard  
- Check recent transactions instantly  
- Filter or search for specific categories (like “salary” or “fuel”)  
- Add new transactions manually (for demo purposes)

All user data is protected with encrypted authentication and token-based access control.

---
## 🔐 Security & Authentication  

It prioritizes **data security and privacy** through:  

- 🔒 **Password Hashing (bcrypt)** — ensures safe password storage  
- 🔑 **Token-based Authentication (JWT)** — validates user sessions securely  
- 🧹 **Session Management** — users can log out anytime; tokens are cleared from local storage  

This guarantees that sensitive data and credentials are never exposed to any third party or developer.
---

## 🌟 Features  

### 🔸 1. Secure User Authentication  
Encrypted login and registration using bcrypt and JWT.

### 🔸 2. Dynamic Transaction Dashboard  
Displays all recent transactions in an interactive, color-coded UI.

### 🔸 3. Lazy Loading (Performance Optimization)  
- Loads first 5 transactions initially  
- Additional transactions appear dynamically on scroll with a smooth loading animation  
- Reduces load time and memory usage

### 🔸 4. Search & Filter Options  
- Quickly find specific transactions (e.g., “salary”, “expense”)  
- Shows *“No transactions found”* if not matched  

### 🔸 5. Progressive Web App (PWA)  
- Works both as a website and installable mobile app  
- Offline access through cached data  
- Combines the power of web + mobile seamlessly  

### 🔸 6. Responsive & Interactive Design  
Modern animations, clean layout, and optimized display across all screen sizes.

---

## 🧮 How It Works  

1. **User Registration:**  
   User registers with name, email, password, account number, and IFSC code.  
   Passwords are securely hashed before being stored.

2. **Login & Authentication:**  
   User logs in → JWT token is generated and stored locally.  
   Token validates access to all private routes.

3. **Transaction Management:**  
   Fetches and displays transactions.  
   Color-coded as **Income (green)** and **Expense (red)**.  
   Users can search or filter transactions easily.

4. **Lazy Loading:**  
   Initially shows 5 transactions → loads more as the user scrolls down.

5. **Logout & Close:**  
   - **Logout** clears the stored token and ends the session.  
   - **Close** redirects back to the home page without clearing data.  
---

## Screenshots

| Register | User Login |
|-----------|------------|
| ![Register](https://github.com/pooja2006git/Insight_Ledger_PWA/blob/main/images/img2.jpeg?raw=true) | ![Login](https://github.com/pooja2006git/Insight_Ledger_PWA/blob/main/images/img3.jpeg?raw=true) |

|  User Dashboard  | Lazy Loading |
|-------------------|----------------|
| ![User Account Dashboard](https://github.com/pooja2006git/Insight_Ledger_PWA/blob/main/images/img4.jpeg?raw=true) | ![Lazy Loading](https://github.com/pooja2006git/Insight_Ledger_PWA/blob/main/images/img5.jpeg?raw=true) |

---

## Deployment

### Tech Stack

- **Frontend:** React + Vite  
- **Backend:** Django REST Framework
-  **Security**  JWT Authentication 
- **Database:** SQLite (for local development)  
- **Encryption:** AES-256 (via CryptoJS)  
- **Local Storage:** IndexedDB  
- **Platform:** Progressive Web App (PWA)

---

## 🚀 Future Enhancements  

- ✅ Real bank API integration for live data  
- 📊 AI-based spending analytics and suggestions  
- 📄 Export passbook summary (PDF/Excel)  
- 🔔 Smart alerts for income/expense thresholds

---

