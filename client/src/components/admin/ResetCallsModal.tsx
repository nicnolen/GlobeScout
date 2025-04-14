import React, { JSX } from 'react';
import { useMutation } from '@apollo/client';
import { UserData } from '../../types/users';
import { RESET_SINGLE_API_CALLS } from '../../graphQL/usersMutations';
import { catchErrorHandler } from '../../utils/errorHandlers';
import Modal from '../common/Modal';

interface ResetCallsModalProps {
    selectedUser: UserData | null;
    serviceToReset: string;
    handleClose: () => void;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function ResetCallsModal({
    selectedUser,
    serviceToReset,
    handleClose,
    message,
    setMessage,
}: ResetCallsModalProps): JSX.Element {
    const [resetApiUsage] = useMutation(RESET_SINGLE_API_CALLS, {
        refetchQueries: ['getAllUsers'],
    });

    const handleResetCallsSubmit = async (email: string, service: string) => {
        try {
            await resetApiUsage({ variables: { email, service } });
            setMessage(`${service} request count reset for ${email}`);
            handleClose();
        } catch (err: unknown) {
            catchErrorHandler(err, 'Failed to reset usage', setMessage);
        }
    };

    const footerButtons = (
        <button
            onClick={() => {
                handleResetCallsSubmit(selectedUser.email, serviceToReset);
            }}
            className="px-4 py-2 button dangerButton"
        >
            Reset
        </button>
    );

    return (
        <Modal
            isOpen={true}
            onClose={handleClose}
            title="Reset Api Calls"
            footerButtons={footerButtons}
            message={message}
            size="md"
        >
            <p className="mb-4">
                Are you sure you want to reset <b>{serviceToReset}</b> requests for <b>{selectedUser.email}</b>?
            </p>
        </Modal>
    );
}
