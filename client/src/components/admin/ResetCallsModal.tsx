import React, { JSX } from 'react';
import { UserData } from '../../../../types/users';

interface ResetCallsModalProps {
    selectedUser: UserData | null;
    serviceToReset: string;
    handleClose: () => void;
    handleResetCallsSubmit: (email: string, service: string) => void;
    message: string;
}

export default function ResetCallsModal({
    selectedUser,
    serviceToReset,
    handleClose,
    handleResetCallsSubmit,
    message,
}: ResetCallsModalProps): JSX.Element {
    if (!selectedUser) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h3 className="text-xl font-semibold mb-4">Reset API Calls</h3>
                <p className="mb-4">
                    Are you sure you want to reset <strong>{serviceToReset}</strong> requests for{' '}
                    <strong>{selectedUser.email}</strong>?
                </p>
                <div className="flex justify-end space-x-4">
                    <button onClick={handleClose} className="px-4 py-2 button secondaryButton">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            handleResetCallsSubmit(selectedUser.email, serviceToReset);
                        }}
                        className="px-4 py-2 button dangerButton"
                    >
                        Reset
                    </button>
                </div>
                {message && <p className="text-sm text-gray-600 mt-4">{message}</p>}
            </div>
        </div>
    );
}
