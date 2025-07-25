
# Insight_Ledger_PWA
![WhatsApp Image 2025-07-25 at 10 50 54 AM](https://github.com/user-attachments/assets/e3350443-923e-4d7f-b514-f5053ff19337)

## 📚 Table of Contents

- [Overview](#-overview)
- [Project Description](#-project-description)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Architecture & Design](#-architecture--design)
- [Screenshots](#-screenshots)
- [Challenges](#-challenges)
- [Contributions](#-contributions)
- [Deployment](#-deployment)
- [Team](#-team)


##  Overview

In many parts of the world, **digital banking assumes constant connectivity**—a luxury not everyone can rely on. Whether in rural communities, during travel, or through routine outages, users are often **locked out of their own financial history** simply due to poor internet access.

**Insight Ledger** was built to **challenge that assumption**.

It’s a semi-offline, secure passbook viewer designed for environments where **connectivity is temporary but clarity is essential**. With a single login session, a user's transaction data is fetched, encrypted in-browser, and stored for **permanent offline access**.

This project sits at the intersection of:

- **Digital Inclusion**: Making fintech tools usable for underserved geographies.  
- **Data Privacy**: Client-side encryption ensures sensitive data never leaves the user’s device unprotected.  
- **Resilient Design**: Works without needing a server after setup. No fragile dependencies.  

Rather than building another interface for online banking, we reimagined the **passbook itself**—an age-old tool for personal finance clarity—and gave it a modern, encrypted, progressive form.

> Insight Ledger isn't just a technical solution—it's a rethink of what access means in an unequal internet landscape.

---

##  Project Description

**Insight Ledger** is a secure and intelligent digital banking solution built to function seamlessly even in low or no internet connectivity.

> This solution stands out with its robust *security measures, smooth **authentication** flow, and efficient **data encryption. It enables users to **manage and track transactions** in a smart, user-friendly way—**even offline**.

Leveraging **Progressive Web App (PWA)** capabilities, the app ensures smooth cross-platform performance. By using **lazy loading** techniques, it significantly **reduces server load** and supports **infrastructure cost optimization** for banks.

Whether on low-end devices or unstable networks, *Smart E-Passbook* ensures that users enjoy a consistent and secure digital banking experience.

![WhatsApp Image 2025-07-25 at 10 19 25 AM](https://github.com/user-attachments/assets/594be1b4-6c94-4566-9ce6-362ab7793e0f)

##  Features

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


##  How It Works

<img width="1920" height="1080" alt="work" src="https://github.com/user-attachments/assets/a0b51ac9-a60b-4969-9e1e-e22b3cb3f4a7" />


The **Insight Ledger** system follows a streamlined, secure workflow from login to transaction management:

1. **User Authentication**
   - Users log in using a registered email address and password.
   - Biometric authentication (if enabled on the device) adds an extra layer of security.
   - Only valid email formats (e.g., `name@domain.com`) and strong passwords are accepted.
   
2. **Bank Account Linking**
   - Users link their bank account securely by entering:
     -  Valid account number (numeric only)
     -  IFSC code (alphanumeric, uppercase only)
     -  Real name (validated)
   - The data is encrypted using **AES encryption** before being stored or transmitted.

3. **Data Storage and Caching**
   - Upon first successful login, transaction data is fetched from the server.
   - Data is stored locally in **IndexedDB** using smart caching strategies for offline access.

4. **Transaction Visualization**
   - Transactions are displayed with dynamic icons and color-coded indicators (green for income, red for expense).
   - Users can view timestamps, categories, and transaction amounts.

5. **Offline Mode Support**
   - Users can manually toggle between **Online** and **Offline** modes via a dedicated button.
   - When offline, the app loads data from local cache (IndexedDB) and functions seamlessly.

7. **Security at Every Step**
   - Authentication is handled via *token-based login*, ensuring secure session management.
   - All requests and data exchanges are protected using *end-to-end HTTP encryption (HTTPS)*.
   
8. **Cross-Platform and Lightweight**
   - Built as a **Progressive Web App (PWA)**, ensuring native-like performance on web, mobile, and tablets.
   - Optimized using **lazy loading** to reduce server load and ensure fast load times on low-end devices.

##  Screenshots

| Home Page | User Login |
|-----------|----------------|
| ![WhatsApp Image 2025-07-25 at 10 50 54 AM](https://github.com/user-attachments/assets/69f0d8ad-b42d-40cc-8864-146144bd46d4) |![WhatsApp Image 2025-07-25 at 12 10 14 PM](https://github.com/user-attachments/assets/aee20892-0663-4948-a561-a0197b86ab96)


| Link Bank Account | User Dashboard |
|-------------------|------------------|
| ![WhatsApp Image 2025-07-25 at 12 10 33 PM](https://github.com/user-attachments/assets/8029747e-d273-4a81-92ae-c357e4f601ba)|![WhatsApp Image 2025-07-25 at 10 19 25 AM](https://github.com/user-attachments/assets/d57e84e1-1cd5-4b79-a0d8-45ba959cb3e3)

## 🚧 Challenges Faced

Building a semi-offline, encrypted financial app in a short hackathon window came with unique challenges:

- **In-Browser AES-256 Encryption**
Encrypting transaction data client-side using AES-256 without compromising performance or breaking reactivity was a delicate balance. We had to ensure that encryption occurred **before any data was stored** while keeping it **asynchronous and non-blocking** for the UI.

- **Working with IndexedDB**
Unlike localStorage, **IndexedDB is asynchronous and schema-driven**, making it powerful but unintuitive. Managing versioning, handling upgrades gracefully, and ensuring reliable read/write operations across sessions required careful abstraction and fallback handling.

- **Sync Strategy and Offline Behavior**
Designing a **"semi-offline" flow** was nuanced. We needed to:
- Detect first-time vs returning users.
- Trigger secure sync only when needed.
- Gracefully fall back to offline mode without confusing the user.

- **State Persistence and Data Binding**
React state doesn’t persist across reloads. We had to engineer a system where **stored data in IndexedDB could hydrate the UI seamlessly** on relaunch—without reauthentication, and with encryption intact.

- **Testing Offline UX**
Simulating offline behavior in dev environments was tricky. We had to:
- Emulate no-network conditions.
- Validate IndexedDB fallback across browsers.
- Ensure users always had access to a functional UI regardless of network status.

> These challenges helped us dive deeper into the **intersection of frontend performance, encryption, storage, and UX resilience**—and shaped the final architecture of Insight Ledger.

## 🤝 Contributing

We welcome meaningful contributions to enhance security, performance, and offline-first functionality. Whether you're improving AI suggestions or refining PWA behavior, your efforts matter.

This system is also designed for integration with open APIs and sector-level platforms to support scalable, real-world adoption and collaborative innovation.

## 🚀 Deployment

The *Insight Ledger* system is built using a modern and efficient tech stack to ensure secure, scalable, and offline-capable functionality.

### 🛠 Technologies Used:
- *Frontend:* React (with Vite) for fast rendering and smooth user experience
- *Backend:* Django REST Framework for secure API development
- *Database:* SQLite (lightweight and suitable for local development)
- *Security:* AES Encryption for all sensitive data
- *Local Storage:* IndexedDB for offline caching
- *Cross-Platform:* Built as a *Progressive Web App (PWA)* to support installation on mobile, desktop, and tablets

### 🌐 Hosting & Deployment:
- The project is currently *hosted locally* and tested successfully on different devices and browsers.
- The PWA works even in *offline mode* after a single successful login using smart caching.
- Lazy loading and optimized data fetching ensure reduced server costs and enhanced performance.

### 📽 Live Prototype Demo:
> For a detailed walkthrough of the working model and how it runs locally with offline access,  
> 📺 *Check out the YouTube video here:*  
👉 [Demo: Insight Ledger - Secure Offline PWA]([https://your-youtube-link-here.com](https://youtu.be/XjuBI6zYfYA?si=_yE9__x_OkgWu8Io]) 


