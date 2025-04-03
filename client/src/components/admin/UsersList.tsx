import React, { JSX, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { UserData } from '../../../../types/users';
import { GET_ALL_USERS, EDIT_USER, DELETE_USER } from '../../graphQL/usersQueries';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';
import { catchErrorHandler } from '../../utils/errorHandlers';

export default function UsersList(): JSX.Element {
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [message, setMessage] = useState<string>('');

    const {
        data: users,
        loading: usersLoading,
        error: usersError,
    } = useQuery<{ getAllUsers: UserData[] }>(GET_ALL_USERS);

    const [editUser] = useMutation(EDIT_USER, {
        refetchQueries: ['getAllUsers'], // Refresh user list after edit
    });

    const [deleteUser] = useMutation(DELETE_USER, {
        refetchQueries: ['getAllUsers'], // Re-fetch the user list after deletion
    });

    const handleOpenEditModal = (user: UserData) => {
        // strip out __typename and lastLogin from the user (those fields will not be mutated)
        const cleanedUser = JSON.parse(
            JSON.stringify(user, (key, value) => (key === '__typename' || key === 'lastLogin' ? undefined : value)),
        );

        setMessage('');
        setSelectedUser(cleanedUser);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    const handleEditSubmit = async () => {
        if (!selectedUser) {
            return;
        }

        try {
            await editUser({
                variables: { email: selectedUser?.email, input: selectedUser },
            });
            setMessage('User updated successfully');
            setTimeout(() => {
                setIsEditModalOpen(false);
            }, 2000);
        } catch (err: unknown) {
            const customMessage = 'Error updating user';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

    const handleDeleteSubmit = async (email: string) => {
        try {
            await deleteUser({
                variables: { email },
            });
            setMessage('User deleted successfully');
            setTimeout(() => {
                setIsDeleteModalOpen(false);
            }, 2000);
        } catch (err: unknown) {
            const customMessage = 'Error deleting user';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

    const handleOpenDeleteModal = (user: UserData) => {
        setMessage('');
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const handleResetCalls = (email: string, api: string) => {
        console.log(`Reset calls for ${api} of user: ${email}`);
    };

    if (usersLoading) {
        return <p>Loading users...</p>;
    }
    if (usersError) {
        return <p className="text-red-600">Error: {usersError.message}</p>;
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
                                            onClick={() => handleOpenEditModal(user)}
                                            className="button primaryButton px-3 py-1 text-sm"
                                        >
                                            <i className="fas fa-edit mr-1" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleOpenDeleteModal(user)}
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
                    handleClose={handleCloseEditModal}
                    handleEditSubmit={handleEditSubmit}
                    message={message}
                />
            )}

            {isDeleteModalOpen && selectedUser && (
                <DeleteUserModal
                    selectedUser={selectedUser}
                    handleClose={handleCloseDeleteModal}
                    handleDeleteSubmit={handleDeleteSubmit}
                    message={message}
                />
            )}
        </>
    );
}
