import React from 'react';
import { FirebaseAppProvider } from 'reactfire';
import config from '../config/config';

const firebaseConfig = JSON.parse(
    Buffer.from(config.FIREBASE_CONFIG, 'base64').toString()
);

function Root({ children }) {
    return (
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
            {children}
        </FirebaseAppProvider>
    );
}

export default Root;