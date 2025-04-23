"use client";
import { useEffect, useState } from 'react';
import { useUser } from "../components/UserContext";
import http_request from "../../../http-request";
import { ToastMessage } from '../components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import { ReactLoader } from '../components/common/Loading';
 


export default function Clock({ userId }) {
  const { user } = useUser();
  const [status, setStatus] = useState('Loading...');
  const [currentDate, setCurrentDate] = useState('');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isClockedOut, setIsClockedOut] = useState(false);
  const [comment, setComment] = useState('');
  const [userAttendance, setUserAttendance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setCurrentDate(formattedDate);

    const checkStatus = async () => {
      try {
        setIsLoading(true);
        const res = await http_request.get(`/attendance/getTodayStatus/${user?.user?._id}`);
        const { data } = res;
        // console.log(data);
        setUserAttendance(data?.record?.taskComment)
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
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.user?._id) {
      checkStatus();
    }
  }, [user]);

  const handleClockIn = async () => {
    try {
      setIsLoading(true);
      const res = await http_request.post('/attendance/clock-in', {
        userId: user?.user?._id,
        user: user?.user?.name
      });
      setStatus('Clocked In at ' + new Date(res.data.clockIn).toLocaleTimeString());
      setIsClockedIn(true);
    } catch (error) {
      console.error('Clock In Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setIsLoading(true);
      const res = await http_request.post('/attendance/clock-out', {
        userId: user?.user?._id,
        user: user?.user?.name
      });
      setStatus('Clocked Out at ' + new Date(res.data.clockOut).toLocaleTimeString());
      setIsClockedOut(true);
    } catch (error) {
      console.error('Clock Out Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      ToastMessage({ status: false, msg: "Comment cannot be empty." });
      return;
    }

    try {
      setIsLoading(true);
      const response = await http_request.put('/attendance/addDailyComment', {
        userId: user?.user?._id,
        taskComment: comment,
      });
      const { data } = response;
      setUserAttendance(comment)
      ToastMessage(data);
      setComment();
    } catch (error) {
      console.error('Add Comment Error:', error);
      ToastMessage({ status: false, msg: "Failed to add comment." });
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("userAttendance",userAttendance);


  return (
    <>
      <Toaster />
      {isLoading === true ? <div className='h-screen flex justify-center items-center'>
        <ReactLoader />
      </div>
        : <>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

            <div className="p-4 border rounded-lg w-full text-center">
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

            <div className="p-4 border rounded-lg w-full grid grid-cols-1 gap-1 items-center">
              <textarea
                className="border p-2 w-full rounded"
                placeholder="Add your task comment..."
                rows={3}
                onChange={e => setComment(e.target.value)}
                value={comment || userAttendance}
              />
              {!userAttendance &&
                <div className="flex justify-start md:justify-end">
                  <button
                    className={`bg-blue-500 text-white p-2 rounded ${!isClockedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleAddComment}
                    disabled={!isClockedIn}
                  >
                    Add Comment
                  </button>
                </div>
              }
            </div>
          </div>
       
        </>
      }
    </>
  );
}
