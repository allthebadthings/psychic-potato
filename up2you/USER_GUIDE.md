# Up2You Jewelry E-Commerce Platform - User Guide

Welcome to your new Up2You Jewelry platform! This document serves as a quick start guide to help you navigate, manage, and get the most out of your new e-commerce system.

## 🌟 System Overview

Your platform consists of three main components working together:

1.  **Jewelry Storefront (Customer Site)**: Where your customers browse and buy products.
2.  **Admin Dashboard**: Where you manage inventory, products, and integrations.
3.  **Backend API**: The engine powering everything behind the scenes.

---

## 🚀 Getting Started

### Accessing the Platforms

*   **Customer Storefront**: `http://localhost:5174` (or your deployed URL)
*   **Admin Dashboard**: `http://localhost:5173/login` (or your deployed URL)

### Admin Login

To access the Admin Dashboard, use the following credentials (for development):

*   **Admin Token**: `dev-admin-token`
*   **Google Login**: You can also use the "Continue with Google" button for a simulated quick login.

---

## 💎 Features & How-To

### 1. Managing Inventory (Admin Panel)

Once logged into the Admin Dashboard, you will land on the **Inventory** tab.

*   **Add New Product**:
    *   Fill out the form on the left side.
    *   **Photos**: Upload multiple images. The first image uploaded becomes the primary (cover) image. You can reorder them by clicking "Make Primary".
    *   **Bundles**: Check the "Add to Bundle / Is Bundle Modifier" box if this item is part of a special deal.
    *   **Advanced**: Set a "Min Price" for backend controls if needed.
*   **Delete Product**: Click the "Delete" button next to any product in the list on the right.

### 2. Integrations (Shopify, eBay, Whatnot)

Navigate to the **Integrations** tab in the Admin Dashboard to connect external platforms.

*   **Shopify**: Enter your Shop Domain and Access Token to sync products.
*   **eBay & Whatnot**: Toggle the checkboxes to enable these integrations (configuration options coming soon).

### 3. Bundles & Discounts

We've built a robust bundling system to increase average order value.

*   **Customer View**: Customers can visit the **Bundles** page (`/bundles`) to see curated sets.
*   **Discounts**: Bundle products automatically display their savings (e.g., "Save 15%").
*   **Cart Logic**: The system automatically calculates the correct discounted price when a bundle is added to the cart.

---

## 🛒 Customer Experience Highlights

*   **Dynamic Cart**: The shopping cart updates instantly and persists even if the customer refreshes the page.
*   **Smart Pricing**: Discounted bundle prices are clearly shown in the catalog and product pages.
*   **Responsive Design**: The site looks great on mobile, tablet, and desktop.

---

## 🛠 Technical Notes for Developers

*   **Backend Server**: Must be running with `ADMIN_API_TOKEN` configured in the environment variables.
*   **Frontend**: Built with React, Vite, and Tailwind CSS.
*   **State Management**: Uses Zustand for a fast and reliable shopping cart experience.

---

**Need Help?**
If you encounter any issues or need a new feature, please contact your development team.
