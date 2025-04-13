import { Box, Typography } from '@mui/material';
import { JSX, memo, useCallback, useEffect, useState } from 'react';
import { IScoreDisplayEntity } from '../../entities/score-display.entity';
import { scoreServiceInstance } from '../../services/score/score.service.instance';

function ScoreDisplay(): JSX.Element {
    const [scoreData, setScoreData] = useState<IScoreDisplayEntity | null>(null);

    const onScoreUpdateCallback = useCallback(
        function onNewScore(scoreEntity: IScoreDisplayEntity) {
            setScoreData(scoreEntity);
        },
        [setScoreData],
    );

    useEffect(
        () => {
            scoreServiceInstance.streamScore({
                onNewScore: onScoreUpdateCallback,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return (
        <Box marginTop="2rem" marginBottom="4rem">
            <Typography variant="h6">Your score</Typography>
            <Typography variant="h4">{scoreData ? scoreData.score : 'Loading score...'}</Typography>
        </Box>
    );
}

export default memo(ScoreDisplay);
