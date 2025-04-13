import { Box, Button, Typography } from '@mui/material';
import { JSX, memo, useCallback, useRef, useState } from 'react';
import { AvailablePairsEnum } from '../../../../common/enums/available-pairs.enum';
import { GuessRequestEntity, IGuessRequestEntity } from '../../entities/guess-request.entity';
import { GuessTypeEnum } from '../../enums/guessing.enum';
import { guessingServiceInstance } from '../../services/guessing/guessing.service.instance';
import GuessSnackbar, { IGuessSnackbarHandle } from './components/guess-snackbar';

function GuessingButtons(): JSX.Element {
    const [isGuessing, setIsGuessing] = useState(false);
    const alreadyMadeGuessSnackbarRef = useRef<IGuessSnackbarHandle>(null);
    const guessSuccessfullyPlacedSnackbarRef = useRef<IGuessSnackbarHandle>(null);

    const handleGuessCallback = useCallback(
        async function performGuess(guess: GuessTypeEnum) {
            if (isGuessing) {
                return;
            }

            const guessRequest: IGuessRequestEntity = new GuessRequestEntity(AvailablePairsEnum.BTC_USD, guess);
            try {
                await guessingServiceInstance.performGuess(guessRequest);
                guessSuccessfullyPlacedSnackbarRef.current?.open();
            } catch (error) {
                console.error('Error while performing guess', error);
                alreadyMadeGuessSnackbarRef.current?.open();
            } finally {
                setIsGuessing(false);
            }
        },
        [isGuessing, guessSuccessfullyPlacedSnackbarRef.current, alreadyMadeGuessSnackbarRef.current],
    );

    return (
        <>
            <Typography marginBottom="1rem" marginTop="2rem">
                Make your guess...
            </Typography>

            <Box display="flex" gap="2rem">
                <Button
                    disabled={isGuessing}
                    variant="contained"
                    fullWidth
                    color="success"
                    onClick={() => handleGuessCallback(GuessTypeEnum.UP)}>
                    Up
                </Button>

                <Button
                    disabled={isGuessing}
                    variant="contained"
                    fullWidth
                    color="error"
                    onClick={() => handleGuessCallback(GuessTypeEnum.DOWN)}>
                    Down
                </Button>
            </Box>
            <GuessSnackbar message="You have successfully made a guess!" ref={guessSuccessfullyPlacedSnackbarRef} />
            <GuessSnackbar
                message="You have already made a guess. Please, wait for it to be resolved."
                ref={alreadyMadeGuessSnackbarRef}
            />
        </>
    );
}

export default memo(GuessingButtons);
