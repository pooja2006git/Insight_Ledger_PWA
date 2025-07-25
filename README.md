# Insight_Ledger_PWA

![WhatsApp Image 2025-07-25 at 10 50 54 AM](https://github.com/user-attachments/assets/e3350443-923e-4d7f-b514-f5053ff19337)

---

## 📚 Table of Contents

- [Overview](#overview)
- [Project Description](#project-description)
- [Features](#features)
- [How It Works](#how-it-works)
- [Screenshots](#screenshots)
- [Challenges](#challenges-faced)
- [Contributions](#contributing)
- [Deployment](#deployment)
- [Team](#team)

---

## Overview

In many parts of the world, **digital banking assumes constant connectivity**—a luxury not everyone can rely on. Whether in rural communities, during travel, or through routine outages, users are often **locked out of their own financial history** simply due to poor internet access.

**Insight Ledger** was built to **challenge that assumption**.

It’s a semi-offline, secure passbook viewer designed for environments where **connectivity is temporary but clarity is essential**. With a single login session, a user's transaction data is fetched, encrypted in-browser, and stored for **permanent offline access**.

This project sits at the intersection of:

- **Digital Inclusion**: Making fintech tools usable for underserved geographies  
- **Data Privacy**: Client-side encryption ensures sensitive data never leaves the user’s device unprotected  
- **Resilient Design**: Works without needing a server after setup. No fragile dependencies

> Insight Ledger isn't just a technical solution—it's a rethink of what access means in an unequal internet landscape.

---

## Project Description

**Insight Ledger** is a secure and intelligent digital banking solution built to function seamlessly even in low or no internet connectivity.

> This solution stands out with its robust *security measures*, smooth **authentication** flow, and efficient **data encryption**. It enables users to **manage and track transactions** in a smart, user-friendly way—**even offline**.

Leveraging **Progressive Web App (PWA)** capabilities, the app ensures smooth cross-platform performance. By using **lazy loading** techniques, it significantly **reduces server load** and supports **infrastructure cost optimization** for banks.

Whether on low-end devices or unstable networks, *Smart E-Passbook* ensures that users enjoy a consistent and secure digital banking experience.

![WhatsApp Image 2025-07-25 at 10 19 25 AM](https://github.com/user-attachments/assets/594be1b4-6c94-4566-9ce6-362ab7793e0f)

---

## Features

- **Seamless Offline Access**  
  > Smart caching and IndexedDB storage allow the app to work even with low or no internet connectivity.

- **Secure Biometric & Email Authentication**  
  > Only pilot users with valid email credentials and biometric authentication can access the system securely.

- **Encrypted Data Transactions**  
  > All transaction data is protected with AES encryption, ensuring confidentiality and data integrity.

- **Cross-Platform PWA Support**  
  > Installable and functional on any device—mobile, desktop, or tablet—just like a native app.

- **Bank Infrastructure Optimization**  
  > Reduces server load and banking infrastructure cost using lazy loading techniques and local data handling.

---

## How It Works

<img width="1920" height="1080" alt="work" src="https://github.com/user-attachments/assets/a0b51ac9-a60b-4969-9e1e-e22b3cb3f4a7" />

1. **User Authentication**  
   Users log in using a registered email address and password. Biometric authentication (if enabled) adds an extra layer of security.

2. **Bank Account Linking**  
   User inputs are validated and encrypted:
   - Account Number
   - IFSC Code
   - Account Holder Name

3. **Data Storage and Caching**  
   Transaction data is fetched once, encrypted, and stored using IndexedDB.

4. **Transaction Visualization**  
   Transactions are categorized and styled with colored tags/icons (green for income, red for expenses).

5. **Offline Mode Support**  
   Users can toggle offline mode manually. All data is accessed via IndexedDB.

6. **Security at Every Step**  
   Token-based login, HTTPS transport, and AES encryption ensure security throughout.

7. **Cross-Platform and Lightweight**  
   Built as a PWA, with lazy loading and responsiveness optimized for low-end devices.

---

## Screenshots

| Home Page | User Login |
|-----------|------------|
| ![Home](https://github.com/user-attachments/assets/69f0d8ad-b42d-40cc-8864-146144bd46d4) | ![Login](https://github.com/user-attachments/assets/aee20892-0663-4948-a561-a0197b86ab96) |

| Link Bank Account | User Dashboard |
|-------------------|----------------|
| ![Link](https://github.com/user-attachments/assets/8029747e-d273-4a81-92ae-c357e4f601ba) | ![Dashboard](https://github.com/user-attachments/assets/d57e84e1-1cd5-4b79-a0d8-45ba959cb3e3) |

---

## Challenges Faced

- **In-Browser AES-256 Encryption**  
  Encrypting data before local storage without blocking the UI required careful async logic.

- **Working with IndexedDB**  
  Schema management, upgrades, and consistent read/write operations were a significant challenge.

- **Sync Strategy and Offline Behavior**  
  We had to detect first-time users, trigger sync intelligently, and ensure graceful offline fallback.

- **State Persistence and Data Binding**  
  React state doesn’t persist. We engineered IndexedDB-to-UI hydration without reauthentication.

- **Testing Offline UX**  
  We emulated no-network conditions, validated cross-browser behavior, and guaranteed seamless fallback.

> These challenges shaped the final architecture of Insight Ledger and deepened our understanding of offline-first design.

---

## Contributing

We welcome improvements to Insight Ledger’s encryption, UX resilience, and PWA optimization.

If you're passionate about **financial inclusion**, **secure apps**, or **offline-first experiences**, feel free to contribute via issues or pull requests.

---

## Deployment

### Tech Stack

- **Frontend:** React + Vite  
- **Backend:** Django REST Framework  
- **Database:** SQLite (for local development)  
- **Encryption:** AES-256 (via CryptoJS)  
- **Local Storage:** IndexedDB  
- **Platform:** Progressive Web App (PWA)

### Hosting & Demo

- Locally hosted for now, with PWA support across platforms.
- Works offline after first login using smart caching.
- Optimized with lazy loading for performance.

**📽 Live Prototype:**  
[Demo: Insight Ledger – Secure Offline PWA](https://youtu.be/XjuBI6zYfYA?si=_yE9__x_OkgWu8Io)

---

## Team

- [Pooja Sri](http://www.linkedin.com/in/poojasri2006) 
- [Shrinand S Menon](https://www.linkedin.com/in/shrinand-s-menon-b53456296) 
