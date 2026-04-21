// src/components/layout/RightSidebar.tsx
export default function RightSidebar() {
  return (
    <div className="p-4 space-y-4">

      <h2 className="font-semibold">Who to follow</h2>

      <div className="space-y-3">

        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">alice</p>
            <p className="text-xs text-gray-500">suggested</p>
          </div>
          <button className="text-sm text-blue-600">Follow</button>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">bob</p>
            <p className="text-xs text-gray-500">suggested</p>
          </div>
          <button className="text-sm text-blue-600">Follow</button>
        </div>

      </div>

    </div>
  );
}