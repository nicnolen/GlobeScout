import React, { JSX, useEffect } from 'react';
import { UserData } from '../../../../types/users';

interface UserEditModalProps {
    selectedUser: UserData;
    setSelectedUser: React.Dispatch<React.SetStateAction<UserData | null>>;
    handleClose: () => void;
    handleEditSubmit: () => void;
    message: string;
}

export default function EditUserModal({
    selectedUser,
    setSelectedUser,
    handleClose,
    handleEditSubmit,
    message,
}: UserEditModalProps): JSX.Element {
    useEffect(() => {
        setSelectedUser((prev) => (prev ? { ...prev, services: { ...prev.services } } : prev));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
                    <h3 className="text-xl font-semibold mb-4">Edit User</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleEditSubmit();
                        }}
                    >
                        <div>
                            <label className="block">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={selectedUser?.email || ''}
                                onChange={handleInputChange}
                                className="border p-2 w-full mb-2"
                            />
                        </div>
                        <div>
                            <label className="block">Role:</label>
                            <input
                                type="text"
                                name="role"
                                value={selectedUser?.role || ''}
                                onChange={handleInputChange}
                                className="border p-2 w-full mb-2"
                            />
                        </div>
                        <div>
                            <label className="block">Status (Active):</label>
                            <input
                                type="checkbox"
                                name="active"
                                checked={selectedUser?.active || false}
                                onChange={(e) => handleCheckboxChange(e, 'active')}
                                className="mb-2"
                            />
                        </div>
                        <div>
                            <label className="block">Authentication Enabled:</label>
                            <input
                                type="checkbox"
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
                                className="mb-2"
                            />
                        </div>
                        <div>
                            <label className="block">Authentication Methods:</label>
                            {selectedUser?.authentication?.methods &&
                                Object.keys(selectedUser.authentication.methods)
                                    .filter((method) => method !== '__typename')
                                    .map((method) => (
                                        <div key={method} className="flex items-center gap-2 mb-2">
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
                            {Object.keys(selectedUser?.services || {})
                                .filter((service) => service !== '__typename')
                                .map((service) => (
                                    <div key={service} className="flex justify-between items-center mb-2">
                                        <span>{service}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleServiceChange(service)}
                                            className="text-sm px-3 py-1 bg-blue-500 text-white rounded"
                                        >
                                            {selectedUser?.services?.[service] ? 'Revoke' : 'Enable'}
                                        </button>
                                    </div>
                                ))}
                        </div>

                        <div className="flex justify-between mt-4">
                            <button type="button" onClick={handleClose} className="px-4 py-2 button secondaryButton">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 button primaryButton">
                                Save
                            </button>

                            {message && <span className="text-sm text-gray-600 ml-2">{message}</span>}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
