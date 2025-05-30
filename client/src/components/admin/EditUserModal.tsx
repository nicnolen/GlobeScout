import React, { JSX, useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { UserData, AuthMethod } from '../../types/users';
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
    const initialUserRef = useRef(selectedUser);

    const [editUser] = useMutation(EDIT_USER, {
        refetchQueries: ['getAllUsers'],
    });

    const isUserChanged = JSON.stringify(selectedUser) !== JSON.stringify(initialUserRef.current);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSelectedUser((prev) => {
            if (!prev) {
                return prev;
            }

            // Convert 'true'/'false' strings to boolean, otherwise keep the original value
            const updatedValue = value === 'true' ? true : value === 'false' ? false : value;

            return { ...prev, [name]: updatedValue };
        });
    };

    const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setSelectedUser((prev) => {
            if (!prev) {
                return prev;
            }

            return {
                ...prev,
                authentication: {
                    ...prev.authentication,
                    enabled: checked,
                },
            };
        });
    };

    const handleAuthMethodChange = (method: string, isChecked: boolean) => {
        setSelectedUser((prev) => {
            if (!prev) {
                return prev;
            }

            return {
                ...prev,
                authentication: {
                    ...prev.authentication,
                    methods: {
                        ...prev.authentication.methods,
                        [method]: isChecked,
                    },
                },
            };
        });
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

            // Ensure that value is not less than 1
            const updatedValue = Math.max(value, 1);

            const updatedServices = { ...prev.services };
            if (updatedServices[service]) {
                updatedServices[service].maxRequests = updatedValue;
            }

            return {
                ...prev,
                services: updatedServices,
            };
        });
    };

    const availableServices = ['openWeatherApi', 'googleMapsApi'];
    const authMethods = Object.values(AuthMethod);

    const footerButtons = (
        <button
            type="submit"
            onClick={handleEditSubmit}
            className="px-4 py-2 button primaryButton"
            disabled={!isUserChanged}
        >
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
                        value={selectedUser.email}
                        onChange={handleChange}
                        className="input w-full"
                        required
                    />
                </div>

                <div>
                    <label className="font-bold mb-2">Role:</label>
                    <select name="role" value={selectedUser.role} onChange={handleChange} className="input w-full">
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>

                <div>
                    <label className="font-bold mb-2">Active:</label>
                    <select
                        name="active"
                        value={selectedUser.active ? 'true' : 'false'}
                        onChange={handleChange}
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
                        checked={selectedUser.authentication.enabled}
                        onChange={handleAuthChange}
                        className="cursor-pointer"
                    />
                    <label htmlFor="authenticationEnabled" className="ml-2 block text-sm cursor-pointer">
                        Authentication Enabled
                    </label>
                </div>

                <div>
                    <label className="font-bold mb-2">Authentication Methods:</label>
                    <div className="space-y-2 ml-2">
                        {authMethods.map((method) => (
                            <div key={method} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={method}
                                    checked={selectedUser?.authentication?.methods?.[method] ?? false}
                                    onChange={(e) => handleAuthMethodChange(method, e.target.checked)}
                                    className="cursor-pointer"
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

                        {Object.entries(selectedUser.services || {}).filter(
                            ([service, value]) => service !== '__typename' && value !== null,
                        ).length === 0 ? (
                            <span className="text-sm">None</span>
                        ) : (
                            Object.entries(selectedUser.services || {})
                                .filter(([service, value]) => service !== '__typename' && value !== null)
                                .map(([service, value]) => (
                                    <div key={service} className="flex items-center justify-between rounded-md px-3">
                                        <div className="flex items-center gap-6 w-full max-w-sm">
                                            <span className="text-sm text-gray-800 w-24">{service}</span>
                                            <input
                                                type="number"
                                                value={value.maxRequests}
                                                onChange={(e) =>
                                                    handleMaxRequestsChange(service, parseInt(e.target.value, 10))
                                                }
                                                onBlur={(e) => {
                                                    if (e.target.value === '') {
                                                        handleMaxRequestsChange(service, 1);
                                                    }
                                                }}
                                                className="w-20 text-center border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleServiceChange(service)}
                                            className="button dangerButton px-3 py-1 text-sm"
                                        >
                                            <i className="fas fa-times mr-1" />
                                            Revoke
                                        </button>
                                    </div>
                                ))
                        )}
                    </div>

                    <div>
                        <label className="font-bold">Add New Service:</label>
                        <select
                            className="input w-full mt-2"
                            value=""
                            onChange={(e) => {
                                const newService = e.target.value;
                                if (newService) handleServiceChange(newService);
                            }}
                        >
                            <option value="" disabled>
                                Select a service to add
                            </option>
                            {availableServices
                                .filter((service) => !(selectedUser?.services && selectedUser.services[service]))
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
