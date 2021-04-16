---
title: Accounts 
id: accounts
---

Account creation will create a k8ty.app user (with its own unique UID, and identified by your email address), which is
used to access various services across the k8ty.app domain. Some GitHub auth provider information is tied to this user
account, and is used for display purposes to you only, the logged-in user.

A k8ty.app user database record is also auto generated, tied only to your k8ty.app UID, and used to persist k8ty.app
service settings/info. None of your personal auth provider information is persisted to it.

I'm still rolling out some apps, so an account doesn't get you all that much today 🙃

## Creating an Account

This site currently supports user registration, and sign in via GitHub. Simply click "Log In with GitHub" on the
[Account](/account) page, and you will get a pop-up to authorize our `K8TY.APP` GitHub OAuth App to access your GitHub
account.

## Deleting Your Account

At any time, you can de-authorize access to this the `K8TY.APP` OAuth app in GitHub, and if you choose, you can delete
your account on the
[Account](/account) page. Press the big red button labeled `Delete Account` several times to confirm (a countdown will
show), and your account will be deleted. Please note, that log-in tokens are fairly long-lived, so you might see the
error message `Log Out => Log In => Try Again` show in the big red button - if so, simply log out and back in to get a 
fresh token, and then attempt the deletion again.

When your account is deleted, the corresponding database record gets deleted automatically along with it.
