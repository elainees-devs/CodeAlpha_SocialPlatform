// src/components/layout/Navbar.tsx
export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-50">
      
      <div className="font-bold text-lg text-purple-600">
        SocialApp
      </div>

      <div className="ml-auto flex items-center gap-4">
        <input
          placeholder="Search..."
          className="border rounded px-2 py-1 text-sm"
        />

        <button className="text-sm bg-purple-600 text-white px-3 py-1 rounded">
          Profile
        </button>
      </div>
    </div>
  );
}