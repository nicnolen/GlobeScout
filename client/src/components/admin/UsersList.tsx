import React, { JSX, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { UserData } from '../../../../types/users';
import { GET_ALL_USERS, EDIT_USER } from '../../graphQL/usersQueries';
import EditUserModal from './EditUserModal';

export default function UsersList(): JSX.Element {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    const {
        data: users,
        loading: usersLoading,
        error: usersError,
    } = useQuery<{ getAllUsers: UserData[] }>(GET_ALL_USERS);

    const [editUser] = useMutation(EDIT_USER, {
        refetchQueries: ['getAllUsers'], // Refresh user list after edit
    });

    const handleEdit = (user: UserData) => {
        // strip out __typename and lastLogin from the user (those fields will not be mutated)
        const cleanedUser = JSON.parse(
            JSON.stringify(user, (key, value) => (key === '__typename' || key === 'lastLogin' ? undefined : value)),
        );

        setSelectedUser(cleanedUser);
        setIsEditModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!selectedUser) {
            return;
        }

        try {
            await editUser({
                variables: { email: selectedUser?.email, input: selectedUser },
            });
            setIsEditModalOpen(false); // Close the modal after submitting
        } catch (error) {
            console.error('Error updating user:', error);
        }
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
                                            onClick={() => handleEdit(user)}
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

            {isEditModalOpen && (
                <EditUserModal
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    handleClose={() => setIsEditModalOpen(false)}
                    handleSubmit={handleSubmit}
                />
            )}
        </>
    );
}
