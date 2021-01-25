import React from 'react';
import firebase from 'firebase/app';
import config from '../config/config';

const fbc = JSON.parse(
    Buffer.from(config.FIREBASE_CONFIG, 'base64').toString()
);
firebase.initializeApp(fbc);

function Root({ children }) {
    return (
        <>
            {children}
        </>
    );
}

export default Root;