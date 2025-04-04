import React, { JSX, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UserData } from '../../../../types/users';
import { EDIT_USER } from '../../graphQL/usersQueries';
import Modal from '../common/Modal';
import { catchErrorHandler } from '../../utils/errorHandlers';

interface UserEditModalProps {
    selectedUser: UserData;
    setSelectedUser: React.Dispatch<React.SetStateAction<UserData | null>>;
    handleClose: () => void;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function EditUserModal({
    selectedUser,
    setSelectedUser,
    handleClose,
    message,
    setMessage,
}: UserEditModalProps): JSX.Element {
    useEffect(() => {
        setSelectedUser((prev) => (prev ? { ...prev, services: { ...prev.services } } : prev));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const [editUser] = useMutation(EDIT_USER, {
        refetchQueries: ['getAllUsers'],
    });

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
                handleClose();
            }, 2000);
        } catch (err: unknown) {
            const customMessage = 'Error updating user';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedUser((prev) => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const { checked } = e.target;
        setSelectedUser((prev) => (prev ? { ...prev, [field]: checked } : prev));
    };

    const handleServiceChange = (service: string) => {
        setSelectedUser((prev) =>
            prev
                ? {
                      ...prev,
                      services: {
                          ...prev.services,
                          [service]: prev.services[service] ? null : { requestsMade: 0, maxRequests: 50 },
                      },
                  }
                : prev,
        );
    };

    const modalFooter = (
        <div className="flex justify-end">
            <button type="button" onClick={handleEditSubmit} className="px-4 py-2 button primaryButton">
                Edit User
            </button>
            {message && <span className="text-sm text-gray-600 ml-2">{message}</span>}
        </div>
    );

    return (
        <Modal isOpen={true} onClose={handleClose} title="Edit User" footer={modalFooter} size="md">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleEditSubmit();
                }}
                className="space-y-4"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={selectedUser?.email || ''}
                        onChange={handleInputChange}
                        className="border p-2 w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role:</label>
                    <input
                        type="text"
                        name="role"
                        value={selectedUser?.role || ''}
                        onChange={handleInputChange}
                        className="border p-2 w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="active"
                        name="active"
                        checked={selectedUser?.active || false}
                        onChange={(e) => handleCheckboxChange(e, 'active')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                        Status (Active)
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="authenticationEnabled"
                        name="authenticationEnabled"
                        checked={selectedUser?.authentication?.enabled || false}
                        onChange={(e) =>
                            setSelectedUser((prev) =>
                                prev
                                    ? {
                                          ...prev,
                                          authentication: {
                                              ...prev.authentication,
                                              enabled: e.target.checked,
                                          },
                                      }
                                    : prev,
                            )
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="authenticationEnabled" className="ml-2 block text-sm text-gray-700">
                        Authentication Enabled
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Authentication Methods:</label>
                    <div className="space-y-2 ml-2">
                        {selectedUser?.authentication?.methods &&
                            Object.keys(selectedUser.authentication.methods)
                                .filter((method) => method !== '__typename')
                                .map((method) => (
                                    <div key={method} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={method}
                                            checked={selectedUser.authentication.methods[method] ?? false}
                                            onChange={(e) =>
                                                setSelectedUser((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              authentication: {
                                                                  ...prev.authentication,
                                                                  methods: {
                                                                      ...prev.authentication.methods,
                                                                      [method]: e.target.checked,
                                                                  },
                                                              },
                                                          }
                                                        : prev,
                                                )
                                            }
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                        />
                                        <label
                                            htmlFor={method}
                                            className="cursor-pointer capitalize text-sm text-gray-700"
                                        >
                                            {method}
                                        </label>
                                    </div>
                                ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Services:</h4>
                    <div className="space-y-2 border rounded-md p-3 bg-gray-50">
                        {Object.keys(selectedUser?.services || {})
                            .filter((service) => service !== '__typename')
                            .map((service) => (
                                <div key={service} className="flex justify-between items-center">
                                    <span className="text-sm">{service}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleServiceChange(service)}
                                        className={`text-sm px-3 py-1 rounded ${
                                            selectedUser?.services?.[service]
                                                ? 'bg-red-500 hover:bg-red-600'
                                                : 'bg-blue-500 hover:bg-blue-600'
                                        } text-white transition-colors`}
                                    >
                                        {selectedUser?.services?.[service] ? 'Revoke' : 'Enable'}
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </form>
        </Modal>
    );
}
