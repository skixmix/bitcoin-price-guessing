import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { JSX, memo, useCallback, useRef } from 'react';
import { authenticationServiceInstance } from './services/authentication.service.instance';

function LoginPage(): JSX.Element {
    const usernameRef = useRef<HTMLInputElement>(null);

    const handleLoginCallback = useCallback(
        async function performLogin() {
            const username = usernameRef.current?.value;
            if (username) {
                await authenticationServiceInstance.loginWithUsername(username);
            }
        },
        [usernameRef.current],
    );

    const handleEnterKeyOnTextInput = useCallback(
        function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleLoginCallback();
            }
        },
        [handleLoginCallback],
    );

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}>
                <Typography variant="h4">Please login</Typography>

                <Typography variant="caption" textAlign="center">
                    Note: if you never used the app, simply login with a new username.
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                        data-testid="username-input"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="email"
                        placeholder="Please enter your username"
                        autoFocus
                        inputRef={usernameRef}
                        onKeyDown={handleEnterKeyOnTextInput}
                    />

                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleLoginCallback}>
                        Log In
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default memo(LoginPage);
