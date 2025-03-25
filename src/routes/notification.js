
const express = require('express');
const notificationRouter = express.Router();
const admin = require('firebase-admin')
const User = require("../models/user");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
const { userAuth } = require('../middlewares/auth');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

notificationRouter.post('/send-notification', userAuth, async (req, res) => {
    const {userId, title, body, linkUrl } = req.body;
    // const userId = req.user._id;
    // console.log(linkUrl);

    try {
        const user = await User.findById(userId);
        // console.log(user.fcmToken, "here");
        if (!user || !user.fcmToken) {
            return res.status(400).json({message: 'User or FCM token not found'});
        }

        const message = {
            token: user.fcmToken,
            // notification: { 
            //     title, 
            //     body
            // },
            // webpush: {
            //     notification: {
            //         title,
            //         body,
            //         requireInteraction: true ,
            //         click_action: linkUrl
            //     },
            //     fcmOptions: {
            //         link: linkUrl
            //     }
            // },
            data: {
                title,
                body,
                click_action: linkUrl
            }
        };

        const firebaseResponse = await admin.messaging().send(message);
        res.status(200).json({success: true, response: firebaseResponse});
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
})

notificationRouter.post('/save-token', userAuth, async(req, res) => {
    const { fcmToken } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findByIdAndUpdate(userId, { fcmToken }, { new: true, upsert: true });
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error saving FCM token:', error);
        res.status(500).json({ error: 'Failed to save token' });
    }
})

module.exports = notificationRouter;
