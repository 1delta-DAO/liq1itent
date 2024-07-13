
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import _ from 'lodash';

type ApiResponse = any; // Change 'any' to the type of your API response


interface OneInchInput {
    collateralAddress: string
    debtAddress: string
    swapAmount: string
    projectedAddress: string
}

const use1inchApi = () => {
    const [input, setInput] = useState<OneInchInput>({ collateralAddress: '', debtAddress: '', swapAmount: '0', projectedAddress: '' });
    const [data, setData] = useState<ApiResponse | null>(null);
    const slippage = 1
    const fetchApiData = useCallback(_.debounce(async (_input:OneInchInput) => {
        try {
            if (_input.collateralAddress && _input.projectedAddress) {
                const response = await axios.get(
                    `https://api.1inch.io/v5.0/137/swap?fromTokenAddress=${_input.debtAddress
                    }&toTokenAddress=${_input.collateralAddress
                    }&amount=${_input.swapAmount
                    }&fromAddress=${_input.projectedAddress
                    }&slippage=${slippage
                    }&destReceiver=${_input.projectedAddress
                    }&referrerAddress=${_input.projectedAddress
                    }&disableEstimate=true&compatibilityMode=true&burnChi=false&allowPartialFill=false&complexityLevel=0`
                )
                setData(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }, 3000), []);

    useEffect(() => {
        fetchApiData(input);
    }, [input, fetchApiData]);

    return { data, setInput };
};

export default use1inchApi;