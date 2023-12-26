import React from 'react';
import server from 'src/tests/mocks/server';
import {renderWithContext, fireEvent, RenderResult} from 'src/tests/testUtils';
import userEvent from '@testing-library/user-event'
import {defaultContext} from "src/utils/AppContext";
import IndividualSearchForm from "src/components/real-time-screening/IndividualSearchForm";

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
})
afterAll(() => server.close())

// @ts-ignore
jest.mock("react-select", () => ({options, value, name, onChange}) => {
    function handleChange(event: any) {
        const option = options.find(
            (option: { value: any; }) => option.value === event.currentTarget.value
        );
        onChange(option);
    }
    return (
        <select data-testid="select" name={name} value={value} onChange={handleChange}>
            {/*@ts-ignore*/}
            {options.map(({label, value}) => (
                <option key={value} value={value}>
                    {label}
                </option>
            ))}
        </select>
    );
});

describe('Individual Screen form', function () {
    let renderedApp: RenderResult;
    let markAsAuthenticated: jest.Mock<any, any>;
    let searchParametersChanged: jest.Mock<any, any>

    beforeEach(() => {
        markAsAuthenticated = jest.fn();
        searchParametersChanged = jest.fn();

        renderedApp = renderWithContext(
            <IndividualSearchForm
                screen={searchParametersChanged}
                screeningComplete={false}
            />,
            {defaultContext: {...defaultContext, markAsAuthenticated}}
        );
    });

    test('should be in expanded state by default', async () => {
        const addtionalFields = renderedApp.getByTestId('additional-fields');
        expect(addtionalFields).toBeInTheDocument()
    });

    test('should be in collapsed state when screening is done', async () => {
        renderedApp.rerender(
            <IndividualSearchForm
                screen={searchParametersChanged}
                screeningComplete={true}
            />
        )
        const additionalFields = renderedApp.queryByTestId('additional-fields');
        expect(additionalFields).not.toBeInTheDocument()
    });

    describe('Input', function () {
        test('should have a required name input', async () => {
            const requiredName = renderedApp.container.querySelector('input[name="first_name"]:required')
            expect(requiredName).toBeInTheDocument()
        })

        test('should have a middle input', async () => {
            const field = renderedApp.container.querySelector('input[name="middle_name"]')
            expect(field).toBeInTheDocument()
        })

        test('should have a required last input', async () => {
            const requiredName = renderedApp.container.querySelector('input[name="last_name"]:required')
            expect(requiredName).toBeInTheDocument()
        })

        test('should have a dateOfBirth input', async () => {
            const requiredName = renderedApp.container.querySelector('input[name="date_of_birth"]')
            expect(requiredName).toBeInTheDocument()
        })

        test('should have a Address Line 1 input', async () => {
            const field = renderedApp.container.querySelector('input[name="address_line_1"]')
            expect(field).toBeInTheDocument()
        })

        test('should have a Address Line 2 input', async () => {
            const field = renderedApp.container.querySelector('input[name="address_line_1"]')
            expect(field).toBeInTheDocument()
        })

        test('should have a City input', async () => {
            const field = renderedApp.container.querySelector('input[name="city"]')
            expect(field).toBeInTheDocument()
        })

        test('should have a County input', async () => {
            const field = renderedApp.container.querySelector('input[name="county"]')
            expect(field).toBeInTheDocument()
        })

        test('should have a Postal Code input', async () => {
            const field = renderedApp.container.querySelector('input[name="postal_code"]')
            expect(field).toBeInTheDocument()
        })

        test('should have a Country input', async () => {
            const field = renderedApp.container.querySelector('select[name="country"]')
            expect(field).toBeInTheDocument()
        })
    });

    describe('when user click on collapsable icon', () => {
        describe('if form was already collapsed', function () {
            beforeEach(() => {
                renderedApp.rerender(
                    <IndividualSearchForm
                        screen={searchParametersChanged}
                        screeningComplete={true}
                    />
                )
                const collapseButton = renderedApp.getByTestId('collapse-button');
                fireEvent.click(collapseButton);
            })
            test('should show the additional fields', async () => {
                const additionalFields = renderedApp.getByTestId('additional-fields');
                expect(additionalFields).toBeInTheDocument()
            })
        });
        describe('if form was not collapsed', function () {
            beforeEach(() => {
                renderedApp.rerender(
                    <IndividualSearchForm
                        screen={searchParametersChanged}
                        screeningComplete={false}
                    />
                )
                const collapseButton = renderedApp.getByTestId('collapse-button');
                fireEvent.click(collapseButton);
            })
            test('should hide the additional fields', async () => {
                const additionalFields = renderedApp.queryByTestId('additional-fields');
                expect(additionalFields).not.toBeInTheDocument()
            })
        });
    })

    test('should have a clear button', async () => {
        const clearBtn = renderedApp.container.querySelector('button[name="clearBtn"]')
        expect(clearBtn).toBeInTheDocument();
    });

    describe('when user clicks on clear button', function () {
        let clearBtn;
        beforeEach(() => {
            const nameInput = renderedApp.container.querySelector('input[name="first_name"]')
            userEvent.type(nameInput!, 'dummy name')
            clearBtn = renderedApp.container.querySelector('button[name="clearBtn"]')
            fireEvent.click(clearBtn!);
        })
        test('should clear all the fields', async () => {
            const nameInput = renderedApp.container.querySelector('input[name="first_name"]')
            expect(nameInput).toHaveValue('');
        })
    });

    test('should have a \'Screen\' button', async () => {
        const screenBtns = renderedApp.container.querySelectorAll('button[type="submit"]')
        expect(screenBtns).toHaveLength(2);
    });

    describe('when user clicks on \'Screen\' button', function () {
        let screenBtn: Element | null,
            firstName: Element | null,
            middleName: Element | null,
            lastName: Element | null,
            dateOfBirth: Element | null,
            addressLine1: Element | null,
            addressLine2: Element | null,
            city: Element | null,
            county: Element | null,
            postalCode: Element | null,
            country: Element | null;

        beforeEach(() => {
            screenBtn = renderedApp.container.querySelector('button[type="submit"]')
            firstName = renderedApp.container.querySelector('input[name="first_name"]')
            middleName = renderedApp.container.querySelector('input[name="middle_name"]')
            lastName = renderedApp.container.querySelector('input[name="last_name"]')
            dateOfBirth = renderedApp.container.querySelector('input[name="date_of_birth"]')
            addressLine1 = renderedApp.container.querySelector('input[name="address_line_1"]')
            addressLine2 = renderedApp.container.querySelector('input[name="address_line_2"]')
            city = renderedApp.container.querySelector('input[name="city"]')
            county = renderedApp.container.querySelector('input[name="county"]')
            postalCode = renderedApp.container.querySelector('input[name="postal_code"]')
            country = renderedApp.container.querySelector('select[name="country"]')
        })
        describe('If individual name was provided', function () {
            test('should broadcast to screen individual', async () => {
                userEvent.type(firstName!, 'dummy first name')
                userEvent.type(middleName!, 'dummy middle name')
                userEvent.type(lastName!, 'dummy last name')
                fireEvent.change(dateOfBirth!, { target: { value: '1993-03-03' } })
                userEvent.type(addressLine1!, 'dummy addr line 1')
                userEvent.type(addressLine2!, 'dummy addr line 2')
                userEvent.type(city!, 'dummy city')
                userEvent.type(county!, 'dummy county')
                userEvent.type(postalCode!, 'dummy postal code')
                userEvent.selectOptions(country!, 'PK')
                fireEvent.click(screenBtn!);

                expect(searchParametersChanged).toHaveBeenCalledWith({
                    firstName: 'dummy first name',
                    middleName: 'dummy middle name',
                    lastName: 'dummy last name',
                    dateOfBirth: '1993-03-03',
                    addressLine1: "dummy addr line 1",
                    addressLine2: "dummy addr line 2",
                    city: "dummy city",
                    county: "dummy county",
                    country: { label: "Pakistan", value: "PK" },
                    postalCode: "dummy postal code",
                });
            })
        });
        describe('If individual first name was not provided', function () {
            test('should not broadcast to screen individual', async () => {
                userEvent.clear(firstName!);
                fireEvent.click(screenBtn!);

                expect(searchParametersChanged).not.toHaveBeenCalled();
            })
        });

        describe('If individual last name was not provided', function () {
            test('should not broadcast to screen individual', async () => {
                userEvent.clear(lastName!);
                fireEvent.click(screenBtn!);

                expect(searchParametersChanged).not.toHaveBeenCalled();
            })
        });
    });
});

