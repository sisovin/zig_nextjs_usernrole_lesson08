'use client';
import { useState } from 'react';

/* import SearchBar from './SearchBar';
import Logo from './Logo';

export default function Counter() { 
    return (
      <>
        <nav>
          <Logo />
          <SearchBar />
            </nav>
            <main>
                <p>This document will be rendered on Server Side</p>
                <h1>Counter</h1>
                <p>Count: 0</p>
                <button>Increment</button>
                <button>Decrement</button>
            </main>
      </>
    );
} */

export default function Counter() { 
    const [count, setCount] = useState(0);
    return (
      <div>
        <h1 className="text-4xl mb-3">Counter</h1>
        <p>This document will be rendered on client Side</p>
        <h3 className="text-2xl mb-3 mt-3">You clicked {count} times</h3>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-3"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md ml-3 mt-3"
          onClick={() => setCount(count > 0 ? count - 1 : 0)}
        >
          Decrement
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md ml-3 mt-3"
          onClick={() => setCount(0)}
        >
          Reset
        </button>
      </div>
    );
}
