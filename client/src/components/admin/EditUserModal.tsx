import React, { JSX, useState } from 'react';
import { useMutation } from '@apollo/client';
import { UserData, UserRole } from '../../../../types/users';
import { EDIT_USER } from '../../graphQL/usersMutations';
import Modal from '../common/Modal';
import { catchErrorHandler } from '../../utils/errorHandlers';

interface UserEditModalProps {
    selectedUser: UserData;
    setSelectedUser: React.Dispatch<React.SetStateAction<UserData | null>>;
    handleClose: () => void;
}

export default function EditUserModal({ selectedUser, setSelectedUser, handleClose }: UserEditModalProps): JSX.Element {
    const [message, setMessage] = useState<string>('');

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
            setTimeout(handleClose, 2000);
        } catch (err: unknown) {
            const customMessage = 'Error updating user';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedUser((prev) => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setSelectedUser((prev) => {
            if (!prev) return prev;

            // Type assertion to ensure role is of type UserRole
            return { ...prev, role: value as UserRole };
        });
    };

    const handleBooleanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSelectedUser((prev) => (prev ? { ...prev, [name]: value === 'true' } : prev));
    };

    const handleServiceChange = (service: string) => {
        setSelectedUser((prev) => {
            if (!prev) {
                return prev;
            }

            const updatedServices = { ...prev.services };
            if (updatedServices[service]) {
                // Revoke: remove the service entirely
                delete updatedServices[service];
            } else {
                // Add: assign default object
                updatedServices[service] = { requestsMade: 0, maxRequests: 50 };
            }

            return {
                ...prev,
                services: updatedServices,
            };
        });
    };

    const handleMaxRequestsChange = (service: string, value: number) => {
        setSelectedUser((prev) => {
            if (!prev) return prev;

            const updatedServices = { ...prev.services };
            if (updatedServices[service]) {
                updatedServices[service].maxRequests = value;
            }

            return {
                ...prev,
                services: updatedServices,
            };
        });
    };

    const availableServices = ['openWeatherApi', 'googleMapsApi'];

    const footerButtons = (
        <button type="submit" onClick={handleEditSubmit} className="px-4 py-2 button primaryButton">
            Edit User
        </button>
    );

    return (
        <Modal
            isOpen={true}
            onClose={handleClose}
            title="Edit User"
            footerButtons={footerButtons}
            message={message}
            size="md"
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleEditSubmit();
                }}
                className="space-y-4"
            >
                <div>
                    <label className="font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={selectedUser?.email || ''}
                        onChange={handleInputChange}
                        className="input w-full"
                    />
                </div>

                <div>
                    <label className="font-bold mb-2">Role:</label>
                    <select
                        name="role"
                        value={selectedUser?.role || 'user'}
                        onChange={handleRoleChange}
                        className="input w-full"
                    >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>

                <div>
                    <label className="font-bold mb-2">Active:</label>
                    <select
                        name="active"
                        value={selectedUser?.active ? 'true' : 'false'}
                        onChange={handleBooleanChange}
                        className="input w-full"
                    >
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
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
                    />
                    <label htmlFor="authenticationEnabled" className="ml-2 block text-sm">
                        Authentication Enabled
                    </label>
                </div>

                <div>
                    <label className="font-bold mb-2">Authentication Methods:</label>
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
                                        />
                                        <label htmlFor={method} className="cursor-pointer capitalize text-sm">
                                            {method}
                                        </label>
                                    </div>
                                ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-2">Services</h4>
                    <div className="card space-y-3 p-4 mb-5">
                        <label className="block text-sm font-semibold text-gray-800 mb-4">Max Requests:</label>

                        {Object.keys(selectedUser?.services || {}).map((service) => (
                            <div key={service} className="flex items-center justify-between rounded-md px-3">
                                {/* Service Name + Input */}
                                <div className="flex items-center gap-6 w-full max-w-sm">
                                    <span className="text-sm text-gray-800 w-24">{service}</span>
                                    <input
                                        type="number"
                                        value={selectedUser?.services[service]?.maxRequests || 50}
                                        onChange={(e) => handleMaxRequestsChange(service, parseInt(e.target.value, 10))}
                                        className="w-24 text-center border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Revoke Button */}
                                <button
                                    type="button"
                                    onClick={() => handleServiceChange(service)}
                                    className="button dangerButton px-3 py-1 text-sm"
                                >
                                    <i className="fas fa-times mr-1" />
                                    Revoke
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add New Service */}
                    <div>
                        <label className="font-bold">Add New Service:</label>
                        <select
                            className="input w-full mt-2"
                            value=""
                            onChange={(e) => {
                                const newService = e.target.value;
                                if (!newService) return;

                                handleServiceChange(newService);
                            }}
                        >
                            <option value="" disabled>
                                Select a service to add
                            </option>
                            {availableServices
                                .filter((s) => !(selectedUser?.services && selectedUser.services[s]))
                                .map((service) => (
                                    <option key={service} value={service}>
                                        {service}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
