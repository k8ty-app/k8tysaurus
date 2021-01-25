import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import "firebase/auth";


const provider = new firebase.auth.GithubAuthProvider();

const signInWithGitHub = () => {
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            console.log(result);
            var credential = result.credential;
            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            var token = credential.accessToken;

            // The signed-in user info.
            var user = result.user;
            // ...
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
}

function SignInWithProvider(props) {

    return (
        <div className='container top-padded-1rem'>
            <div className='row'>
                <div className='col col--4 col--offset-4'>
                    <div class="card">
                        <div className="card__header">
                            <h3>Sign In / Register</h3>
                        </div>
                        <div className="card__body">
                            <p>
                                Please select from (🙃 the one) supported provider(s) below 👇
                            </p>
                        </div>
                        <div className="card__footer">
                            <button onClick={signInWithGitHub} className="button button--primary button--block" >Log In with GitHub</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='top-padded-1rem'>
                <p>
                    This site currently supports user registration, and sign in via GitHub. Simply click "Log In with GitHub",
                    and you will get a pop-up to authorize the app to access your GitHub account.
                </p>
                <p>
                    This will create a k8ty.app user (with it's own unique UID, and identified by your email address), which is used to access various services
                    across k8ty.app. Some GitHub auth provider information is tied to this user account, and is used for display purposes to you only,
                    the logged in user. A k8ty.app user database record is also auto generated, tied only to your k8ty.app UID, and used to persist k8ty.app service settings/info.
                    None of your personal auth provider information is persisted to it.
                </p>
                <p>
                    At any time, you can de-authorize access to this app in GitHub, and if you choose to delete your account (self-serve button coming soon), the corresponding database record
                    gets deleted automatically along with it.
                </p>
            </div>
        </div>
    );
}

export default SignInWithProvider;