🃏 MTG Vault:
Developer: Jacob Webb

Institution: Full Sail University – Web Design & Development

Instructor: Brandon Brown
Project Overview

MTG Vault is a full-stack specialized deck-building assistant designed for high-performance card tracking. While it serves as a general-purpose tool, it is optimized for managing colorless Eldrazi archetypes, featuring real-time price tracking, high-resolution art rendering, and secure user authentication across Web and Mobile platforms.
🚀 Live Deployments

    Web Frontend (Vercel): https://mtg-deck-builder-psi.vercel.app

    API Backend (Render): https://mtg-deck-builder-o20y.onrender.com

🛠️ Technical Stack

    Frontend: React.js (Vercel Deployment)

    Mobile: React Native / Expo (Native Gesture Handling)

    Backend: Node.js & Express (RESTful API)

    Database: MongoDB Atlas (NoSQL)

    Authentication: JWT (JSON Web Tokens) with AsyncStorage and localStorage

    Third-Party API: Scryfall API for live card data and market prices

✨ Key Features
Shared Features

    Secure Authentication: Integrated Login and Registration flow using encrypted JWT tokens.

    Live Scryfall Integration: Search for any Magic: The Gathering card and fetch up-to-date market values.

    Full CRUD Operations: Users can Create, Read, Update, and Delete cards within their personal vault.

Web Specifics

    Responsive Dashboard: Grid-based layout for desktop management of large collections.

    Manual Price Updates: One-click price synchronization with Scryfall for accurate collection valuation.

Mobile Specifics (Expo)

    Native Gestures: Swipe-to-Delete functionality powered by react-native-gesture-handler.

    Dynamic Card Details: Specialized route (/card-details/[id]) to view high-resolution card art and Oracle text.

    Pull-to-Refresh: Smooth data synchronization with the Render backend using RefreshControl.

    Vault Analytics: Real-time calculation of total collection value displayed in the mobile header.

📡 API Documentation
Method	Endpoint	Description	Auth Required
POST	/api/auth/register	Create a new user account	No
POST	/api/auth/login	Authenticate and receive JWT	No
GET	/api/cards	Retrieve all cards in the vault	No
GET	/api/cards/:id	Retrieve full details for one card	Yes
POST	/api/cards	Add a new card to the database	Yes
PUT	/api/cards/:id	Update card price or metadata	Yes
DELETE	/api/cards/:id	Remove a card from the vault	Yes