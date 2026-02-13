# 🏨 Otelier Explorer
**Cinematic Hotel Discovery & Comparison Dashboard**

Otelier Explorer is a high-performance web application featuring a sleek, high-contrast interface. It showcases modern frontend capabilities like infinite scrolling, skeleton loading, and real-time comparison baskets.

---

## 🛠️ Setup Instructions

Follow these steps to get the project running on your local machine.

### 1. Clone & Install
Open your terminal and run the following:
```bash
git clone <your-repository-url>
cd otelier-explorer
npm install


2. Environment Configuration
Create a file named .env in the root folder of the project. Copy and paste the following variables, replacing the placeholders with your actual keys from Supabase and Amadeus:
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Amadeus API Configuration
VITE_AMADEUS_CLIENT_ID=your_amadeus_api_key
VITE_AMADEUS_CLIENT_SECRET=your_amadeus_api_secret


3. Launch the Application
Start the Vite development server:
npm run dev

Features & Logic
Infinite Scroll: Uses the IntersectionObserver API to load more hotels dynamically as you scroll.

Skeleton Loading: Cinematic shimmer effects provided by SkeletonCard.jsx to maintain layout stability.

Context API: Centralized state management via HotelContext and AuthContext.

High-Visibility UI: Uses font-black and slate-900 for a premium, readable look.