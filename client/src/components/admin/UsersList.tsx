import React, { JSX } from 'react';
import { useQuery } from '@apollo/client';
import { UserData } from '../../../../types/users';
import { GET_ALL_USERS } from '../../graphQL/usersQueries';

export default function UsersList(): JSX.Element {
    const {
        data: users,
        loading: usersLoading,
        error: usersError,
    } = useQuery<{ getAllUsers: UserData[] }>(GET_ALL_USERS);

    const handleEdit = (email: string) => {
        console.log('Edit user:', email);
    };

    const handleDelete = (email: string) => {
        console.log('Delete user:', email);
    };

    const handleResetCalls = (email: string, api: string) => {
        console.log(`Reset calls for ${api} of user: ${email}`);
    };

    if (usersLoading) {
        return <p>Loading users...</p>;
    }
    if (usersError) {
        return <p style={{ color: 'red' }}>Error: {usersError.message}</p>;
    }

    return (
        <>
            <h2 className="pageTitle">Users List</h2>

            <div className="overflow-x-auto w-full">
                <table className="w-full border border-gray-300">
                    <thead className="bg-black text-white">
                        <tr>
                            {['Email', 'Role', 'Last Login', 'Status', 'Auth Enabled', 'Services', 'Actions'].map(
                                (heading) => (
                                    <th
                                        key={heading}
                                        className="px-4 py-3 border border-gray-500 text-sm whitespace-nowrap"
                                    >
                                        {heading}
                                    </th>
                                ),
                            )}
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {users?.getAllUsers?.map((user: UserData) => (
                            <tr key={user.email} className="even:bg-gray-100 hover:bg-gray-200 transition">
                                <td className="px-4 py-3 border">{user.email}</td>
                                <td className="px-4 py-3 border">{user.role}</td>
                                <td className="px-4 py-3 border">{user.lastLogin}</td>
                                <td
                                    className={`px-4 py-3 border font-bold ${user.active ? 'text-green-600' : 'text-red-600'}`}
                                >
                                    {user.active ? 'Active' : 'Inactive'}
                                </td>
                                <td className="px-4 py-3 border">{user.authentication?.enabled ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-3 border">
                                    {Object.keys(user.services || {})
                                        .filter((service) => service !== '__typename')
                                        .map((service) => (
                                            <div
                                                key={service}
                                                className="flex items-center justify-between text-sm mb-1"
                                            >
                                                <span>
                                                    {service}: {user.services[service]?.requestsMade} /{' '}
                                                    {user.services[service]?.maxRequests}
                                                </span>
                                                <button
                                                    onClick={() => handleResetCalls(user.email, service)}
                                                    className="button dangerButton ml-2 px-2 py-1 text-xs"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        ))}
                                </td>
                                <td className="px-4 py-3 border">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(user.email)}
                                            className="button primaryButton px-3 py-1 text-sm"
                                        >
                                            <i className="fas fa-edit mr-1" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.email)}
                                            className="button dangerButton px-3 py-1 text-sm"
                                        >
                                            <i className="fas fa-trash mr-1" /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
