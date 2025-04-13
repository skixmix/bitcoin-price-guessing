import { Typography } from '@mui/material';
import { JSX, memo, useCallback, useEffect, useState } from 'react';
import { AvailablePairsEnum } from '../../../../common/enums/available-pairs.enum';
import { IPriceDisplayEntity } from '../../entities/price-display.entity';
import { priceServiceInstance } from '../../services/price/price.service.instance';

function PriceDisplay(): JSX.Element {
    const [priceData, setPriceData] = useState<IPriceDisplayEntity | null>(null);

    const onPriceUpdateCallback = useCallback(
        function onNewPrice(priceEntity: IPriceDisplayEntity) {
            setPriceData(priceEntity);
        },
        [setPriceData],
    );

    useEffect(
        () => {
            priceServiceInstance.streamPrice({
                pair: AvailablePairsEnum.BTC_USD,
                onNewPrice: onPriceUpdateCallback,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const currentPriceHeader = (
        <Typography variant="h6" component="p" sx={{ mb: 2 }}>
            Current BTC Price
        </Typography>
    );

    if (!priceData) {
        return (
            <>
                {currentPriceHeader}
                <Typography variant="h4" component="p" sx={{ mb: 2 }}>
                    Loading Price...
                </Typography>
            </>
        );
    }
    return (
        <>
            {currentPriceHeader}
            <Typography variant="h4" component="p" sx={{ mb: 2 }}>
                {priceData.price} USD
            </Typography>
            <Typography variant="caption">Updated at {priceData.updatedAt.toLocaleString()}</Typography>
        </>
    );
}

export default memo(PriceDisplay);
