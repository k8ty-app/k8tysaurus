import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import "firebase/auth";
import SignInWithProvider from './SignInWithProvider';

const signOut = () => {
    firebase.auth().signOut();
}

function UserCard(props) {
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        firebase.auth().onAuthStateChanged( authUser => setCurrentUser(authUser));
    });


    if (!currentUser) {
        return <SignInWithProvider></SignInWithProvider>
    }

    return (
        <div className='container top-padded-1rem'>
            <div className='row'>
                <div className='col col--4 col--offset-4'>
                        <div className="card shadow--tl">
                            <div className="card__header">
                                <h3 className='text--center'>{currentUser.displayName}</h3>
                            </div>
                            <div className="card__body">
                                <div className="avatar avatar--vertical">
                                    <img
                                        className="avatar__photo avatar__photo--xl"
                                        src={currentUser.photoURL}
                                    />
                                    <div className="avatar__intro">
                                        <h4 className="avatar__name">{currentUser.email}</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="card__footer">
                                <button onClick={signOut} className="button button--secondary button--block">Sign Out</button>
                            </div>
                        </div>
                </div>
            </div>
        </div>

    );

};

export default UserCard;
