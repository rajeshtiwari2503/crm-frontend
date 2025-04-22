// "use client";
// import { useEffect, useState } from 'react';
// import { useUser } from "../components/UserContext";
// import http_request from "../../../http-request";

// export default function Clock({ userId }) {
//   const { user } = useUser();
//   const [status, setStatus] = useState('Loading...');

//   // ✅ Fetch current day's status when component loads
//   useEffect(() => {
//     const checkStatus = async () => {
//       try {
//         const res = await http_request.get(`/attendance/getTodayStatus/${user?.user?._id }`);
//         if (res.data.clockOut) {
//           setStatus(`Clocked Out at ${new Date(res.data.clockOut).toLocaleTimeString()}`);
//         } else if (res.data.clockIn) {
//           setStatus(`Clocked In at ${new Date(res.data.clockIn).toLocaleTimeString()}`);
//         } else {
//           setStatus('Not Clocked In');
//         }
//       } catch (err) {
//         console.error('Status Check Error:', err);
//         setStatus('Error fetching status.');
//       }
//     };

//     if (user?.user?._id) {
//       checkStatus();
//     }
//   }, [user]);

//   const handleClockIn = async () => {
//     try {
//       const res = await http_request.post('/attendance/clock-in', { userId: user?.user?._id ,user:user?.user?.name});
//       setStatus('Clocked In at ' + new Date(res.data.clockIn).toLocaleTimeString());
//     } catch (error) {
//       console.error('Clock In Error:', error);
//       // setStatus('Failed to Clock In. Please try again.');
//     }
//   };

//   const handleClockOut = async () => {
//     try {
//       const res = await http_request.post('/attendance/clock-out', { userId: user?.user?._id,user:user?.user?.name });
//       setStatus('Clocked Out at ' + new Date(res.data.clockOut).toLocaleTimeString());
//     } catch (error) {
//       console.error('Clock Out Error:', error);
//       // setStatus('Failed to Clock Out. Please try again.');
//     }
//   };

//   return (
//     <div className="p-4 border rounded-lg max-w-md mx-auto text-center">
//       <p className="mb-4 text-lg font-semibold">{status}</p>
//       <button className="bg-green-500 text-white p-2 rounded mr-2" onClick={handleClockIn}>Clock In</button>
//       <button className="bg-red-500 text-white p-2 rounded" onClick={handleClockOut}>Clock Out</button>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from 'react';
import { useUser } from "../components/UserContext";
import http_request from "../../../http-request";

export default function Clock({ userId }) {
  const { user } = useUser();
  const [status, setStatus] = useState('Loading...');
  const [currentDate, setCurrentDate] = useState('');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isClockedOut, setIsClockedOut] = useState(false);

  useEffect(() => {
    // Set today's date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setCurrentDate(formattedDate);

    // Fetch current status
    const checkStatus = async () => {
      try {
        const res = await http_request.get(`/attendance/getTodayStatus/${user?.user?._id}`);
        if (res.data.clockOut) {
          setStatus(`Clocked Out at ${new Date(res.data.clockOut).toLocaleTimeString()}`);
          setIsClockedOut(true);
          setIsClockedIn(true);
        } else if (res.data.clockIn) {
          setStatus(`Clocked In at ${new Date(res.data.clockIn).toLocaleTimeString()}`);
          setIsClockedIn(true);
        } else {
          setStatus('Not Clocked In');
        }
      } catch (err) {
        console.error('Status Check Error:', err);
        setStatus('Error fetching status.');
      }
    };

    if (user?.user?._id) {
      checkStatus();
    }
  }, [user]);

  const handleClockIn = async () => {
    try {
      const res = await http_request.post('/attendance/clock-in', {
        userId: user?.user?._id,
        user: user?.user?.name
      });
      setStatus('Clocked In at ' + new Date(res.data.clockIn).toLocaleTimeString());
      setIsClockedIn(true);
    } catch (error) {
      console.error('Clock In Error:', error);
    }
  };

  const handleClockOut = async () => {
    try {
      const res = await http_request.post('/attendance/clock-out', {
        userId: user?.user?._id,
        user: user?.user?.name
      });
      setStatus('Clocked Out at ' + new Date(res.data.clockOut).toLocaleTimeString());
      setIsClockedOut(true);
    } catch (error) {
      console.error('Clock Out Error:', error);
    }
  };

  return (
    <div className="p-4  border rounded-lg w-full text-center">
      <h2 className="text-xl font-bold mb-2">{currentDate}</h2>
      <p className="mb-4 text-lg font-semibold">{status}</p>
      <button
        className="bg-green-500 text-white p-2 rounded mr-2 disabled:opacity-50"
        onClick={handleClockIn}
        disabled={isClockedIn}
      >
        Clock In
      </button>
      <button
        className="bg-red-500 mb-3 text-white p-2 rounded disabled:opacity-50"
        onClick={handleClockOut}
        disabled={!isClockedIn || isClockedOut}
      >
        Clock Out
      </button>
    </div>
  );
}
