import React, { useEffect, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';

export const ReactLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 120000); // 2minute

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='flex justify-center items-center h-screen'>
      {loading ? (
        // <ThreeDots
        //     visible={true}
        //     height="60"
        //     width="60"
        //     color="#5396b9"
        //     radius="9"
        //     ariaLabel="three-dots-loading"
        //     wrapperStyle={{}}
        //     wrapperClass="flex justify-center items-center"
        // />
        <div className="flex justify-center items-center h-screen">
          <div className="boom-circle relative rounded-full flex justify-center items-center bg-[#b7d4e4]">
            {/* Dots container centered absolutely */}
            <div className="absolute top-1/2 left-1/2 flex space-x-2 -translate-x-1/2 -translate-y-1/2">
              <span className="dot delay-[0s]"></span>
              <span className="dot delay-[0.5s]"></span>
              <span className="dot delay-[1s]"></span>
            </div>
          </div>
          {/* background-color: #d1d5db;   */}
          <style jsx global>{`
                     .boom-circle {
      width: 150px;
      height: 150px;
      animation: boomIn 2s ease-out infinite;
    }

    @media (min-width: 640px) {
      .boom-circle {
        width: 200px;
        height: 200px;
      }
    }

    @media (min-width: 768px) {
      .boom-circle {
        width: 250px;
        height: 250px;
      }
    }

    @keyframes boomIn {
      0% {
        transform: scale(0.2);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
        .dot {
          width: 20px;
          height: 20px;
          border-radius: 9999px;
         border: 2px solid #ffffff; 
          background-color: inherit ;
          animation: fillColor 1.5s infinite;
        }

        @keyframes fillColor {
          0%, 100% {
            background-color: inherit;
          }
          30%, 70% {
            background-color: #5396b9;
          }
        }

        .delay-\[0s\] {
          animation-delay: 0s;
        }

        .delay-\[0\.5s\] {
          animation-delay: 0.5s;
        }

        .delay-\[1s\] {
          animation-delay: 1s;
        }
      `}</style>
        </div>


        //  <div className="flex justify-center items-center h-screen">
        //   <div className="flex space-x-2 relative">
        //     <div className="circle">
        //       <div className="fill"></div>
        //     </div>
        //     <div className="circle delay-1">
        //       <div className="fill"></div>
        //     </div>
        //     <div className="circle delay-2">
        //       <div className="fill"></div>
        //     </div>
        //   </div>

        //   <style jsx global>{`
        //     .circle {
        //       width: 20px;
        //       height: 20px;
        //       background-color: #d1d5db;
        //       border-radius: 50%;
        //       position: relative;
        //       overflow: hidden;
        //     }

        //     .fill {
        //       position: absolute;
        //       top: 0;
        //       left: -100%;
        //       width: 100%;
        //       height: 100%;
        //       background-color: #5396b9;
        //       animation: slideFill 3s infinite; /* Slowed down here */
        //       animation-timing-function: ease-in-out;
        //     }

        //     .delay-1 .fill {
        //       animation-delay: 1s;
        //     }

        //     .delay-2 .fill {
        //       animation-delay: 2s;
        //     }

        //     @keyframes slideFill {
        //       0% {
        //         left: -100%;
        //       }
        //       50% {
        //         left: 0;
        //       }
        //       100% {
        //         left: 100%;
        //       }
        //     }
        //   `}</style>
        // </div>
      ) : (
        <div>Data not available</div>
      )}
    </div>
  );
};
