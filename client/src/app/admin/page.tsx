'use client';

import React, { JSX } from 'react';
import { useQuery } from '@apollo/client';
import { UserData } from '../../../../types/users';
import { GET_ALL_USERS } from '../../graphQL/usersQueries';

export default function Admin(): JSX.Element {
    const {
        data: users,
        loading: usersLoading,
        error: usersError,
    } = useQuery<{ getAllUsers: UserData[] }>(GET_ALL_USERS);

    if (usersLoading) {
        return <p>Loading users...</p>;
    }
    if (usersError) {
        return <p style={{ color: 'red' }}>Error: {usersError.message}</p>;
    }

    return (
        <div>
            <h2>Users List</h2>
            <ul>
                {users?.getAllUsers?.map((user: UserData) => (
                    <li key={user.email}>
                        <strong>{user.email}</strong> - {user.role} - {user.active ? 'Active' : 'Inactive'}
                    </li>
                ))}
            </ul>
        </div>
    );
}
