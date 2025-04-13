import { Button } from '@mui/material';
import { JSX, memo, useCallback } from 'react';
import { authenticationServiceInstance } from '../../../login/services/authentication.service.instance';
import { priceServiceInstance } from '../../services/price/price.service.instance';
import { scoreServiceInstance } from '../../services/score/score.service.instance';

function LogoutButton(): JSX.Element {
    const handleLogoutCallback = useCallback(() => {
        priceServiceInstance.stopStreaming();
        scoreServiceInstance.stopStreaming();
        authenticationServiceInstance.logout();
    }, []);

    return (
        <Button variant="outlined" onClick={handleLogoutCallback} color="primary">
            LOG OUT
        </Button>
    );
}

export default memo(LogoutButton);
