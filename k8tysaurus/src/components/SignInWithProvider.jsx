import React, { useEffect, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
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
                            <p>
                                For more information about k8ty.app user accounts, please see <Link to={useBaseUrl('docs/k8ty-app/accounts')}>the docs</Link>.
                            </p>

                        </div>
                        <div className="card__footer">
                            <button onClick={signInWithGitHub} className="button button--primary button--block" >Log In with GitHub</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignInWithProvider;
