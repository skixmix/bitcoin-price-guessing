import { act, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import GuessSnackbar, { IGuessSnackbarHandle } from './guess-snackbar';

describe('GuessSnackbar', () => {
    const message = 'Test Snackbar Message';

    it('does not render the snackbar initially', () => {
        const ref = createRef<IGuessSnackbarHandle>();
        render(<GuessSnackbar ref={ref} message={message} />);
        expect(screen.queryByText(message)).toBeNull();
    });

    it('renders the snackbar when open() is called via ref', () => {
        const ref = createRef<IGuessSnackbarHandle>();
        render(<GuessSnackbar ref={ref} message={message} />);

        act(() => {
            ref.current?.open();
        });

        const snackbar = screen.getByText(message);
        expect(snackbar).toBeDefined();
    });
});
