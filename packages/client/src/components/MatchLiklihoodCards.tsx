import React, {useEffect, useRef, useState} from 'react';
import {LikliHood} from "src/enums";


interface IProps {
    likliHoodChanged: (likliHood: string) => void
    likliHoodsCount: {
        exact: number,
        veryHigh: number,
        high: number,
        medium: number,
        low: number,
        veryLow: number
    }
}

const MatchLiklihoodCards: (props: IProps) => JSX.Element = (props: IProps) => {
    const isInitialMount = useRef(true);
    const [selectedCard, setSelectedCard] = useState<LikliHood>(LikliHood.All)

    const likliHoodSelected = (likliHood: LikliHood) => {
        if (selectedCard === likliHood) {
            setSelectedCard(LikliHood.All);
        } else {
            setSelectedCard(likliHood);
        }
    }

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            props.likliHoodChanged(selectedCard)
        }
    }, [selectedCard])

    return (
        <div className="d-flex gap-2 flex-nowrap ff-roboto color-monoNormal text-center">
            <div
                className={`${LikliHood.ExactMatch.split(' ').join('')} card card-sm flex-fill box-shadow ${selectedCard === LikliHood.ExactMatch ? 'active exact' : ''}`}
                onClick={() => {likliHoodSelected(LikliHood.ExactMatch)}}
            >
                <h4>{props.likliHoodsCount.exact}</h4>
                <h5>Exact Match</h5>
            </div>
            <div
                className={`${LikliHood.VeryHigh.split(' ').join('')} card card-sm flex-fill box-shadow ${selectedCard === LikliHood.VeryHigh ? 'active very-high' : ''}`}
                onClick={() => {likliHoodSelected(LikliHood.VeryHigh)}}
            >
                <h4>{props.likliHoodsCount.veryHigh}</h4>
                <h5>Very High</h5>
            </div>
            <div
                className={`${LikliHood.High.split(' ').join('')} card card-sm flex-fill box-shadow ${selectedCard === LikliHood.High ? 'active high' : ''}`}
                onClick={() => {likliHoodSelected(LikliHood.High)}}
            >
                <h4>{props.likliHoodsCount.high}</h4>
                <h5>High</h5>

            </div>
            <div
                className={`${LikliHood.Medium.split(' ').join('')} card card-sm flex-fill box-shadow ${selectedCard === LikliHood.Medium ? 'active medium' : ''}`}
                onClick={() => {likliHoodSelected(LikliHood.Medium)}}
            >
                <h4>{props.likliHoodsCount.medium}</h4>
                <h5> Medium</h5>
            </div>

            <div
                className={`${LikliHood.Low.split(' ').join('')} card card-sm flex-fill box-shadow ${selectedCard === LikliHood.Low ? 'active low' : ''}`}
                onClick={() => {likliHoodSelected(LikliHood.Low)}}
            >
                <h4>{props.likliHoodsCount.low}</h4>
                <h5>Low</h5>
            </div>

            <div
                className={`${LikliHood.VeryLow.split(' ').join('')} card card-sm flex-fill box-shadow ${selectedCard === LikliHood.VeryLow ? 'active very-low' : ''}`}
                onClick={() => {likliHoodSelected(LikliHood.VeryLow)}}
            >
                <h4>{props.likliHoodsCount.veryLow}</h4>
                <h5>Very Low</h5>
            </div>
        </div>
    );
};

export default MatchLiklihoodCards;
