'use client';

import React, { JSX } from 'react';
import UsersList from '../../components/admin/UsersList';

export default function Admin(): JSX.Element {
    return (
        <div className="w-full">
            <h1 className="pageTitle">Admin Page</h1>
            <UsersList />
        </div>
    );
}
