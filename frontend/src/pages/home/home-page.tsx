import { Container } from '@mui/material';
import { JSX, memo } from 'react';
import GuessingButtons from './components/guessing-buttons/guessing-buttons';
import LogoutButton from './components/logout-button/logout-button';
import PriceDisplay from './components/price-display/price-display';
import ScoreDisplay from './components/score-display/score-display';

function HomePage(): JSX.Element {
    return (
        <Container
            maxWidth="sm"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                textAlign: 'center',
            }}>
            <PriceDisplay />
            <GuessingButtons />
            <ScoreDisplay />
            <LogoutButton />
        </Container>
    );
}

export default memo(HomePage);
