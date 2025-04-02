import React, { JSX, useState, useEffect } from 'react';

interface UserEditModalProps {
    showModal: boolean;
    selectedUser: any;
    updatedUser: any;
    setUpdatedUser: React.Dispatch<React.SetStateAction<any>>;
    handleCloseModal: () => void;
    handleSubmit: () => void;
}

export default function EdiUserModal({
    showModal,
    selectedUser,
    updatedUser,
    setUpdatedUser,
    handleCloseModal,
    handleSubmit,
}: UserEditModalProps): JSX.Element {
    useEffect(() => {
        console.log(selectedUser, 'selected');
        if (showModal && selectedUser) {
            setUpdatedUser((prev) => ({
                ...prev,
                ...selectedUser, // Copy all fields from selectedUser
                services: { ...selectedUser.services }, // Ensure services are deeply copied
            }));
        }
    }, [showModal, selectedUser, setUpdatedUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdatedUser({
            ...updatedUser,
            [name]: value,
        });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const { checked } = e.target;
        setUpdatedUser({
            ...updatedUser,
            [field]: checked,
        });
    };

    const handleServiceChange = (service: string) => {
        setUpdatedUser({
            ...updatedUser,
            services: {
                ...updatedUser.services,
                [service]: updatedUser.services[service] ? null : { requestsMade: 0, maxRequests: 50 },
            },
        });
    };

    useEffect(() => {
        if (selectedUser) {
            setUpdatedUser({
                ...selectedUser,
                services: { ...selectedUser.services }, // Ensure services are cloned properly
            });
        }
    }, [selectedUser, setUpdatedUser]);

    if (!showModal || !selectedUser) return null;

    return (
        <>
            {/* Overlay to darken the background */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
                    <h3 className="text-xl font-semibold mb-4">Edit User</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <div>
                            <label className="block">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={updatedUser.email}
                                onChange={handleInputChange}
                                className="border p-2 w-full mb-2"
                            />
                        </div>
                        <div>
                            <label className="block">Role:</label>
                            <input
                                type="text"
                                name="role"
                                value={updatedUser.role}
                                onChange={handleInputChange}
                                className="border p-2 w-full mb-2"
                            />
                        </div>
                        <div>
                            <label className="block">Status (Active):</label>
                            <input
                                type="checkbox"
                                name="active"
                                checked={updatedUser.active}
                                onChange={(e) => handleCheckboxChange(e, 'active')}
                                className="mb-2"
                            />
                        </div>
                        <div>
                            <label className="block">Authentication Enabled:</label>
                            <input
                                type="checkbox"
                                name="authenticationEnabled"
                                checked={updatedUser.authentication?.enabled}
                                onChange={(e) =>
                                    setUpdatedUser({
                                        ...updatedUser,
                                        authentication: {
                                            ...updatedUser.authentication,
                                            enabled: e.target.checked,
                                        },
                                    })
                                }
                                className="mb-2"
                            />
                        </div>
                        <div>
                            <label className="block">Authentication Methods:</label>
                            {updatedUser.authentication?.methods &&
                                Object.keys(updatedUser.authentication.methods)
                                    .filter((method) => method !== '__typename')
                                    .map((method) => (
                                        <div key={method} className="flex items-center gap-2 mb-2">
                                            <input
                                                type="checkbox"
                                                id={method}
                                                checked={updatedUser.authentication.methods[method] ?? false}
                                                onChange={(e) =>
                                                    setUpdatedUser((prev) => ({
                                                        ...prev,
                                                        authentication: {
                                                            ...prev.authentication,
                                                            methods: {
                                                                ...prev.authentication.methods,
                                                                [method]: e.target.checked,
                                                            },
                                                        },
                                                    }))
                                                }
                                                className="cursor-pointer"
                                            />
                                            <label htmlFor={method} className="cursor-pointer capitalize">
                                                {method}
                                            </label>
                                        </div>
                                    ))}
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Services:</h4>
                            {Object.keys(updatedUser.services || {})
                                .filter((service) => service !== '__typename')
                                .map((service) => (
                                    <div key={service} className="flex justify-between items-center mb-2">
                                        <span>{service}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleServiceChange(service)}
                                            className="text-sm px-3 py-1 bg-blue-500 text-white rounded"
                                        >
                                            {updatedUser.services[service] ? 'Revoke' : 'Enable'}
                                        </button>
                                    </div>
                                ))}
                        </div>

                        <div className="flex justify-between mt-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
