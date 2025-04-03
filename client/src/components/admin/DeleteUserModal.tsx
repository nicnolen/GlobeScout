import React, { JSX } from 'react';
import { UserData } from '../../../../types/users';

interface UserDeleteModalProps {
    selectedUser: UserData | null;
    handleDeleteSubmit: (email: string) => void;
    handleClose: () => void;
    message: string;
}

export default function EditUserModal({
    selectedUser,
    handleClose,
    handleDeleteSubmit,
    message,
}: UserDeleteModalProps): JSX.Element {
    if (!selectedUser) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
                <p className="mb-4">
                    Are you sure you want to delete the user <strong>{selectedUser.email}</strong>? This action cannot
                    be undone.
                </p>
                <div className="flex justify-end space-x-4">
                    <button onClick={handleClose} className="px-4 py-2 button secondaryButton">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            handleDeleteSubmit(selectedUser.email);
                        }}
                        className="px-4 py-2 button dangerButton"
                    >
                        Delete
                    </button>

                    {message && <span className="text-sm text-gray-600 ml-2">{message}</span>}
                </div>
            </div>
        </div>
    );
}
