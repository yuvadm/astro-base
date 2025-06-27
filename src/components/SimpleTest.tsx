import { useState } from 'react';

export default function SimpleTest() {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Simple Test Component</h1>
      <div className="space-y-4">
        <p>This is a simple React component to test if the infinite refresh is caused by the API calls.</p>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCount(count - 1)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            -
          </button>
          <span className="text-xl font-bold">{count}</span>
          <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            +
          </button>
        </div>
        <p className="text-gray-600">
          If this component works without refreshing, the issue is in the TaskManager API calls.
        </p>
      </div>
    </div>
  );
}