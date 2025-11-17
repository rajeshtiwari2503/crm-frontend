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
  const [attendanceLoading, setAttendanceLoading] = useState(false);

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
        setAttendanceLoading(true);
        // console.log("attendanceLoading setAttendanceLoading to:", attendanceLoading);
        const res = await http_request.get(`/attendance/getTodayStatus/${user?.user?._id}`);
        const { data } = res;
        // console.log(data);
        setUserAttendance(data?.record?.taskComment)
        if (res.data.clockOut) {
          setStatus(`Clocked Out at ${new Date(res.data.clockOut).toLocaleTimeString()}`);
          setIsClockedOut(true);
          setIsClockedIn(true);
        } else if (res.data.clockIn) {
          setStatus(`Clocked In at ${new Date(res.data.clockIn).toLocaleTimeString()} ${data?.record?.location}`);
          // setStatus(`Clocked In at ${new Date(res.data.clockIn).toLocaleTimeString()} from ${res?.data?.record?.location}`);
          setIsClockedIn(true);
        } else {
          setStatus('Not Clocked In');
        }
      } catch (err) {
        console.error('Status Check Error:', err);
        setStatus('Error fetching status.');
      } finally {
        setAttendanceLoading(false);
      }
    };

    if (user?.user?._id) {
      checkStatus();
    }
  }, [user]);
 
  // const handleClockIn = async () => {
  //   try {
  //     setAttendanceLoading(true);
  //     const res = await http_request.post('/attendance/clock-in', {
  //       userId: user?.user?._id,
  //       user: user?.user?.name
  //     });
  //     setStatus('Clocked In at ' + new Date(res.data.clockIn).toLocaleTimeString());
  //     setIsClockedIn(true);
  //   } catch (error) {
  //     console.error('Clock In Error:', error);
  //   } finally {
  //     setAttendanceLoading(false);
  //   }
  // };



  const handleClockIn = async () => {
    try {
      setAttendanceLoading(true);
        //  console.log("attendanceLoading setAttendanceLoading in login to:", attendanceLoading);
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        // setAttendanceLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          if (latitude && longitude) {
            // console.log("Latitude:", latitude, "Longitude:", longitude);

            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k`
              );
              const data = await response.json();

              if (data.results && data.results.length > 0) {
                const bestMatch = data.results[0]; // Most accurate match

                const address = bestMatch.formatted_address;

                // Extract district
                const districtComponent = bestMatch.address_components.find((component) =>
                  component.types.includes("administrative_area_level_2")
                );
                const district = districtComponent ? districtComponent.long_name : "District not found";

                // Extract state
                const stateComponent = bestMatch.address_components.find((component) =>
                  component.types.includes("administrative_area_level_1")
                );
                const state = stateComponent ? stateComponent.long_name : "State not found";

                // console.log("Address:", address);
                // console.log("District:", district);
                // console.log("State:", state);

                // Now call your Clock-In API with address, district, state, latitude, longitude
                const res = await http_request.post('/attendance/clock-in', {
                  userId: user?.user?._id,
                  user: user?.user?.name,
                  location: address
                });

                setStatus(`Clocked In at ${new Date().toLocaleTimeString()} from ${address}`);
                setIsClockedIn(true);
                ToastMessage({ status: true, msg: "You  Clocked In successfully!" });
              } else {
                console.warn("No location results found for the given coordinates.");
                ToastMessage({ status: false, msg: "Unable to fetch your location. Please try again.!" });
                // alert("Unable to fetch your location. Please try again.");
              }
            } catch (error) {
              console.error("Error fetching address: ", error);
              ToastMessage({ status: false, msg: "Failed to fetch location details. Please try again.!" });
              // alert("Failed to fetch location details. Please try again.");
            }
          } else {
            console.warn("Latitude and Longitude are missing.");
            ToastMessage({ status: false, msg: "Unable to retrieve your location.!" });
            // alert("Unable to retrieve your location.");
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Location access denied by the user.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              alert("The request to get user location timed out.");
              break;
            default:
              alert("An unknown error occurred while fetching location.");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Enable high accuracy
      );
    } catch (error) {
      console.error('Clock In Error:', error);
      ToastMessage({ status: false, msg: "Clock In Error.!" });
    } finally {
     await new Promise(resolve => setTimeout(resolve, 2000)); // ✅ Delay 2 seconds
    setAttendanceLoading(false); // ✅ This now works
  }
  };




  const handleClockOut = async () => {
    try {
      setAttendanceLoading(true);
      const res = await http_request.post('/attendance/clock-out', {
        userId: user?.user?._id,
        user: user?.user?.name
      });
      setStatus('Clocked Out at ' + new Date(res.data.clockOut).toLocaleTimeString());
      ToastMessage({ status: true, msg: "You  Clocked Out successfully!" });
      setIsClockedOut(true);
    } catch (error) {
      console.error('Clock Out Error:', error);
    } finally {
     await new Promise(resolve => setTimeout(resolve, 2000)); // ✅ Delay 2 seconds
    setAttendanceLoading(false); // ✅ This now works
  }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      ToastMessage({ status: false, msg: "Comment cannot be empty." });
      return;
    }

    try {
      setAttendanceLoading(true);
      const response = await http_request.put('/attendance/addDailyComment', {
        userId: user?.user?._id,
        taskComment: comment,
      });
      const { data } = response;
      setUserAttendance(comment)
      ToastMessage({ status: true, msg: "Comment added successfully" });
      setComment();
    } catch (error) {
      console.error('Add Comment Error:', error);
      ToastMessage({ status: false, msg: "Failed to add comment." });
    } finally {
     await new Promise(resolve => setTimeout(resolve, 2000)); // ✅ Delay 2 seconds
    setAttendanceLoading(false); // ✅ This now works
  }
  };

  // console.log("userAttendance",userAttendance);
  // console.log("attendanceLoading", attendanceLoading);

  return (
    <>
      <Toaster />
      {attendanceLoading ? (
        <div className='h-[400px] flex justify-center items-center'>
          <ReactLoader />
        </div>
      ) : (
        <>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

            <div className="p-4 border rounded-lg w-full text-center">
              <h2 className="text-xl font-bold mb-2">{currentDate}</h2>
              <p className="mb-4 text-lg font-semibold">{status}</p>
              <button
                className="bg-green-500 text-white p-2 rounded mr-2 disabled:opacity-50"
                onClick={handleClockIn}
                disabled={isClockedIn || attendanceLoading}
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
      )}
    </>
  );
}
