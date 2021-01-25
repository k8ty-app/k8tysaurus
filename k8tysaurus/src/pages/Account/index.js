import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import UserCard from '../../components/UserCard';


function Account() {

    return (
        <Layout
            title="Account">
            <UserCard></UserCard>
        </Layout>
    )

};

export default Account;