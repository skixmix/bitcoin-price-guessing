import { Snackbar } from '@mui/material';
import React, { forwardRef, JSX, memo, useImperativeHandle, useState } from 'react';

export interface GuessSnackbarProps {
    message: string;
}

export interface IGuessSnackbarHandle {
    open: () => void;
}

const GuessSnackbar = forwardRef<IGuessSnackbarHandle, GuessSnackbarProps>(function renderGuessSnackbar(
    props: Readonly<GuessSnackbarProps>,
    ref,
): JSX.Element {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
    }));

    const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            message={props.message}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        />
    );
});

export default memo(GuessSnackbar);
