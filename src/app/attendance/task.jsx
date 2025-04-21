"use client"
import axios from 'axios';
import { useState } from 'react';

export default function Tasks({ userId }) {
  const [taskId, setTaskId] = useState('');
  const [message, setMessage] = useState('');

  const handleStart = async () => {
    const res = await axios.put(`http://localhost:5000/api/tasks/start/${taskId}`);
    setMessage('Task Started at ' + new Date(res.data.startTime).toLocaleTimeString());
  };

  const handlePause = async () => {
    const res = await axios.put(`http://localhost:5000/api/tasks/pause/${taskId}`);
    setMessage('Task Paused. Time spent: ' + res.data.timeSpent + ' min');
  };

  const handleComplete = async () => {
    const res = await axios.put(`http://localhost:5000/api/tasks/complete/${taskId}`);
    setMessage('Task Completed. Total Time: ' + res.data.timeSpent + ' min');
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <input className="border p-2 w-full mb-2" placeholder="Task ID" onChange={e => setTaskId(e.target.value)} />
      <button className="bg-blue-500 text-white p-2 rounded mr-2" onClick={handleStart}>Start</button>
      <button className="bg-yellow-500 text-white p-2 rounded mr-2" onClick={handlePause}>Pause</button>
      <button className="bg-green-600 text-white p-2 rounded" onClick={handleComplete}>Complete</button>
      <p className="mt-4 font-medium">{message}</p>
    </div>
  );
}
