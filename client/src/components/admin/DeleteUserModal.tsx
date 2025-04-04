import React, { JSX } from 'react';
import { useMutation } from '@apollo/client';
import { UserData } from '../../../../types/users';
import { DELETE_USER } from '../../graphQL/usersQueries';
import Modal from '../common/Modal';
import { catchErrorHandler } from '../../utils/errorHandlers';

interface UserDeleteModalProps {
    selectedUser: UserData | null;
    handleClose: () => void;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function DeleteUserModal({
    selectedUser,
    handleClose,
    message,
    setMessage,
}: UserDeleteModalProps): JSX.Element {
    const [deleteUser] = useMutation(DELETE_USER, {
        refetchQueries: ['getAllUsers'],
    });

    const handleDeleteSubmit = async (email: string) => {
        try {
            await deleteUser({
                variables: { email },
            });
            setMessage('User deleted successfully');
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (err: unknown) {
            const customMessage = 'Error deleting user';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

    const modalFooter = (
        <div className="flex justify-end">
            <button
                type="button"
                onClick={() => handleDeleteSubmit(selectedUser.email)}
                className="px-4 py-2 button dangerButton"
            >
                Delete User
            </button>
            {message && <span className="text-sm text-gray-600 ml-2">{message}</span>}
        </div>
    );

    return (
        <Modal isOpen={true} onClose={handleClose} title="Delete User" footer={modalFooter} size="md">
            <p className="mb-4">
                Are you sure you want to delete the user <strong>{selectedUser.email}</strong>? This action cannot be
                undone.
            </p>
        </Modal>
    );
}
