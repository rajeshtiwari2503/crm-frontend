"use client";

import axios from 'axios';
import { useState } from 'react';

export default function Tasks({ userId }) {

  const [comment, setComment] = useState(''); // New state for comment




  return (
    <div className="  p-4 border rounded-lg w-full grid grid-cols-1  gap-1 items-center">
      {/* Textarea Section */}
      <div>
        <textarea
          className="border p-2 w-full   rounded"
          placeholder="Add your task comment..."
          rows={3}
          onChange={e => setComment(e.target.value)}
        ></textarea>
      </div>

      {/* Button Section */}
      <div className="flex justify-start md:justify-end">
        <button
          className="bg-blue-500 text-white p-1 rounded"
          // onClick={handleAddComment} // make sure you define this function
        >
          Add Comment
        </button>
      </div>
    </div>

  );
}
