
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import { useSocketContext } from './SocketContext';
import { useUser } from '../UserContext';
import NotificationDialog from './notificationDialog/NotificationDialog';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { socket, onlineUsers } = useSocketContext();
    const { user } = useUser();

    const [notifications, setNotifications] = useState([]);

    const isOnline = onlineUsers.includes(user?.user?._id)
    console.log("isOnline", isOnline);


    useEffect(() => {
        if (!socket || !user?.user?._id) return;

        const currentUserId = user.user._id;
        const currentUserRole = user.user.role;

        const addNotification = (type, data) => {
            setNotifications((prev) => [...prev, { type, data }]);
        };

        const onComplaintUpdate = (data) => {
            const isForServiceCenter = currentUserRole === 'SERVICE' && data?.assignedTo?.serviceCenterId === currentUserId;
            const isForBrand = currentUserRole === 'BRAND' && data?.brandId === currentUserId;
            const isForAdmin = currentUserRole === 'ADMIN';

            if (isForServiceCenter || isForBrand || isForAdmin) {
                addNotification('complaint', data);
            }
        };

        const onWarrantyUpdate = (data) => {
            const isForBrand = currentUserRole === 'BRAND' && data?.brandId === currentUserId;
            if (isForBrand || currentUserRole === 'ADMIN') {
                addNotification('warranty', data);
            }
        };

        const onStickerGenerated = (data) => {
            if (currentUserRole === 'ADMIN' || data?.generatedBy === currentUserId) {
                addNotification('sticker', data);
            }
        };

        socket.on('complaintStatusUpdated', onComplaintUpdate);
        socket.on('warrantyActivated', onWarrantyUpdate);
        // socket.on('stickerGenerated', onStickerGenerated);

        return () => {
            socket.off('complaintStatusUpdated', onComplaintUpdate);
              socket.off('warrantyActivated', onWarrantyUpdate);
            //   socket.off('stickerGenerated', onStickerGenerated);
        };
    }, [socket, user]);

    const closeNotification = () => {
        setNotifications((prev) => prev.slice(1));
    };

    // console.log("notifications", notifications);
    return (
        <NotificationContext.Provider value={{ notifications, closeNotification }}>
            {children}

            {notifications.length > 0 && (
                <NotificationDialog
                    notification={notifications[0]}
                    onClose={closeNotification}
                />

            )}
        </NotificationContext.Provider>
    );
};
