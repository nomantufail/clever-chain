import React from 'react';
import server, {loginApiReturning_403} from 'src/tests/mocks/server';
import {renderWithContext, fireEvent, RenderResult} from 'src/tests/testUtils';
import {defaultContext} from "src/utils/AppContext";
import MatchLiklihoodCards from "../../components/MatchLiklihoodCards";
import {LikliHood} from "src/enums";

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
})
afterAll(() => server.close())

describe('MatchLiklihoodCards', function () {
    let renderedApp: RenderResult;
    let markAsAuthenticated: jest.Mock<any, any>;
    let likliHoodChanged: jest.Mock<any, any>,
        likliHoodsCount: any

    beforeEach(() => {
        markAsAuthenticated = jest.fn();
        likliHoodsCount = {exact: 0, veryHigh: 0, high: 0, medium: 0, low: 0};
        likliHoodChanged = jest.fn();
        renderedApp = renderWithContext(
            <MatchLiklihoodCards
                likliHoodChanged={likliHoodChanged}
                likliHoodsCount={likliHoodsCount}
            />,
            {defaultContext: {...defaultContext, markAsAuthenticated}}
        );
    });

    for (let match in LikliHood) {
        if (match !== 'All') {
            test(`should show ${LikliHood[match as keyof typeof LikliHood]} match card`, () => {
                const exactCard = renderedApp.container.querySelector(`.${LikliHood[match as keyof typeof LikliHood].split(' ').join('')}`)
                expect(exactCard).toBeInTheDocument();
            })
        }
    }

    for (let match in LikliHood) {
        if (match !== 'All') {
            describe(`when clicked on ${LikliHood[match as keyof typeof LikliHood]} match card`, function () {
                let card: Node | Window | null;
                beforeEach(() => {
                    card = renderedApp.container.querySelector(`.${LikliHood[match as keyof typeof LikliHood].split(' ').join('')}`);
                    fireEvent.click(card!);
                })
                describe(`if not already activated`, () => {
                    test(`should activate the card`, () => {
                        expect(card).toHaveClass('active');
                    })

                    test(`should broadcast \'likliHoodChanged\' with the activated card`, () => {
                        expect(likliHoodChanged).toHaveBeenCalledWith(LikliHood[match as keyof typeof LikliHood]);
                    })
                })

                describe('if already activated', () => {
                    test('should de-activate the card', () => {
                        fireEvent.click(card!);
                        expect(card).not.toHaveClass('active');
                    })

                    test('should broadcast \'likliHoodChanged\' with the \'All\' option', () => {
                        fireEvent.click(card!);
                        expect(likliHoodChanged).toHaveBeenCalledWith(LikliHood.All);
                    })
                })
            });
        }
    }

})
;

