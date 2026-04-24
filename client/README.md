# SocialPlatform Frontend

A modern, high-performance social media frontend application built with **React**, **TypeScript**, and **TanStack**. This project features a robust architecture designed for scalability, featuring file-based routing, efficient server-state management, and a clean, responsive UI.

## 🚀 Features

- **Authentication System**: Secure login and registration with JWT-based persistence.
- **Protected Routes**: Granular route guarding for authenticated users.
- **Dynamic Feed**: Real-time interaction with posts, including creation and deletion.
- **Social Graph**: Follow and unfollow system to manage user connections.
- **User Profiles**: Comprehensive user profiles with post history and social stats.
- **Suggested Users**: Discovery system for finding new people to follow.
- **Responsive Design**: Mobile-first UI built with Tailwind CSS.
- **Optimistic Updates**: Smooth user experience using TanStack Query for data fetching and mutations.

## 🛠 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [TanStack Router](https://tanstack.com/router/latest) (File-based routing)
- **State Management**: 
  - **Server State**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
  - **Global/Auth State**: [Zustand](https://github.com/pmndrs/zustand)
- **API Client**: [Axios](https://axios-http.com/) with interceptors for auth headers
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 📂 Project Structure

```text
src/
├── assets/         # Static assets (images, icons)
├── components/     # Reusable UI components (auth, post, layout, etc.)
├── features/       # Feature-specific logic and components
├── hooks/          # Custom React hooks
├── pages/          # Page-level components
├── routes/         # TanStack Router file-based route definitions
├── services/       # API service layer (Axios instance and endpoints)
├── store/          # Global state (Zustand stores)
├── types/          # TypeScript interface and type definitions
└── utils/          # Utility functions and helpers
```

## ⚙️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/elainees-devs/CodeAlpha_SocialPlatform.git
   cd CodeAlpha_SocialPlatform/client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

## 🚀 Running the Project

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles the project into highly optimized static assets for production. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs ESLint to check for code quality and style issues. |

## 🏗 Architecture Overview

- **Routing & Layouts**: Uses `@tanstack/react-router` for a type-safe, file-based routing system. Layouts are managed via `RootShell.tsx` and `__root.tsx`.
- **API Layer**: Centralized Axios instance in `services/api.ts` handles base URLs and automatically attaches JWT tokens from `localStorage` to outgoing requests via interceptors.
- **State Management**: 
  - **Auth**: Zustand handles the authentication state and synchronization with `localStorage`.
  - **Data Fetching**: TanStack Query manages caching, loading states, and background synchronization for posts, profiles, and social interactions.
- **Component Pattern**: Follows a modular approach, separating core UI components from complex feature-based logic.

## 📝 Implementation Notes

- **Auth Flow**: The `AuthGate` and `ProtectedRoute` components ensure that private data is only accessible to logged-in users.
- **Post Interactions**: Mutations (like/delete) use TanStack Query to provide a snappy feel, with invalidation strategies to keep the feed fresh.
- **Follow System**: Implemented as a toggle logic within the `usePosts` and `follow.service` hooks.

## 🌐 Deployment

This project is optimized for deployment on platforms like **Vercel** or **Netlify**.

1. Connect your GitHub repository.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Add your environment variables in the platform's dashboard.

## 🚀 Future Improvements

- [ ] Real-time notifications using WebSockets (Socket.io).
- [ ] Direct messaging between users.
- [ ] Advanced image cropping and filtering before upload.
- [ ] Dark mode support and customizable themes.
- [ ] Search functionality for users and hashtags.

---
Built with ❤️ by [elainees-devs](https://github.com/elainees-devs)
