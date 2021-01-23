import React from 'react';
import Layout from '@theme/Layout';
import { FirebaseAppProvider } from 'reactfire';
import config from '../config/config';

const firebaseConfig = JSON.parse(
    Buffer.from(config.FIREBASE_CONFIG, 'base64').toString()
);

function FireLayout(props) {

    return (
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
            <Layout {...props}>
                {props.children}
            </Layout>
        </FirebaseAppProvider>
    )

}

export default FireLayout;