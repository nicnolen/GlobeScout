import React, { JSX, useState } from 'react';
import { useQuery } from '@apollo/client';
import { UserData } from '../../../../types/users';
import { GET_ALL_USERS } from '../../graphQL/usersQueries';
import { removeFields } from '../../utils/helpers/graphQLHelpers';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';
import ResetCallsModal from './ResetCallsModal';

export default function UsersList(): JSX.Element {
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isResetCallsModalOpen, setIsResetCallsModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [serviceToReset, setServiceToReset] = useState(null);
    const [message, setMessage] = useState<string>('');

    const {
        data: users,
        loading: usersLoading,
        error: usersError,
    } = useQuery<{ getAllUsers: UserData[] }>(GET_ALL_USERS);

    const handleOpenEditModal = (user: UserData) => {
        // strip out __typename and lastLogin from the user (those fields will not be mutated)
        const cleanedUser = removeFields(user, ['__typename', 'lastLogin']);

        setMessage('');
        setSelectedUser(cleanedUser);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
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

    const handleOpenResetCallsModal = (email: string, service: string) => {
        setMessage('');
        setSelectedUser({ email } as UserData); // minimal shape needed for modal
        setServiceToReset(service);
        setIsResetCallsModalOpen(true);
    };

    const handleCloseResetCallsModal = () => {
        setIsResetCallsModalOpen(false);
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
                    <tbody>
                        {users?.getAllUsers?.map((user: UserData) => (
                            <tr key={user.email} className="even:bg-gray-100 hover:bg-gray-200 transition">
                                <td className="px-4 py-3 border">{user.email}</td>
                                <td className="px-4 py-3 border">{user.role}</td>
                                <td className="px-4 py-3 border">{user.lastLogin}</td>
                                <td
                                    className={`px-4 py-3 border border-black font-bold ${user.active ? 'text-green-600' : 'text-red-600'}`}
                                >
                                    {user.active ? 'Active' : 'Inactive'}
                                </td>
                                <td className="px-4 py-3 border">{user.authentication?.enabled ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-3 border">
                                    {Object.entries(user.services || {}).filter(
                                        ([service, value]) => service !== '__typename' && value !== null,
                                    ).length === 0 ? (
                                        <span className="text-sm">None</span>
                                    ) : (
                                        Object.entries(user.services || {})
                                            .filter(([service, value]) => service !== '__typename' && value !== null)
                                            .map(([service, { requestsMade, maxRequests }]) => (
                                                <div
                                                    key={service}
                                                    className="flex items-center justify-between text-sm mb-1"
                                                >
                                                    <span>
                                                        {service}: {requestsMade} / {maxRequests}
                                                    </span>
                                                    <button
                                                        onClick={() => handleOpenResetCallsModal(user.email, service)}
                                                        className="button dangerButton ml-2 px-2 py-1 text-xs"
                                                    >
                                                        Reset
                                                    </button>
                                                </div>
                                            ))
                                    )}
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
                />
            )}

            {isDeleteModalOpen && selectedUser && (
                <DeleteUserModal
                    selectedUser={selectedUser}
                    handleClose={handleCloseDeleteModal}
                    message={message}
                    setMessage={setMessage}
                />
            )}

            {isResetCallsModalOpen && selectedUser && (
                <ResetCallsModal
                    selectedUser={selectedUser}
                    serviceToReset={serviceToReset}
                    handleClose={handleCloseResetCallsModal}
                    message={message}
                    setMessage={setMessage}
                />
            )}
        </>
    );
}
