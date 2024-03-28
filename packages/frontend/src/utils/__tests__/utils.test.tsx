import { describe, expect, it, vi } from 'vitest';
import { getClassesList } from '../getClassesList';
import { getSearch } from '../getSearch';
import { IUser, UserRole, UserStatus } from 'src/types';
import { validateUserValues } from '../validateUserValues';
import translation from 'src/translations/Russian.json';
import { checkUserAuthorization } from '../checkUserAuthorization';
import { render, screen } from '@testing-library/react';
import { Notification } from 'src/components';
import { showElement } from '../showElement';
import { hideElement } from '../hideElement';

const mainClassMock = 'main-class-test';
const usersMock = [
  {
    id: '1',
    name: 'Paul',
    telegramName: '@paulo',
    role: UserRole.Admin,
    status: UserStatus.Active,
  },
  {
    id: '2',
    name: 'John',
    telegramName: '@brick',
    role: UserRole.Coordinator,
    status: UserStatus.Inactive,
  },
];
const filledFieldsMock = {
  name: 'Test',
  role: UserRole.Coordinator,
  telegramName: '@test_test',
};
const validationErrorMock = {
  name: translation.enterName,
  role: translation.chooseRole,
  telegramName: translation.enterTelegramName,
};
const veryLongNameMock =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam iaculis, odio ac sollicitudin maximus, tellus arcu malesuada lacus, fringilla pretium urna lorem velit. In non bibendum felis. Donec felis libero, ullamcorper non finibus ut, malesuada ut dolor.';
const veryLongTelegramName = '@Loremipsumdolorsitametconsectetu';

vi.mock('src/utils/getUser.ts', async () => {
  const actual = await vi.importActual('src/utils/getUser.ts');

  return {
    ...actual,
    getUser: () => vi.fn().mockReturnValue(true),
  };
});

describe('Testing: utils', () => {
  it.each`
    additionalClass            | errorClass            | expected
    ${undefined}               | ${undefined}          | ${'main-class-test'}
    ${'additional-class-test'} | ${undefined}          | ${'main-class-test additional-class-test'}
    ${undefined}               | ${'error-class-test'} | ${'main-class-test error-class-test'}
    ${'additional-class-test'} | ${'error-class-test'} | ${'main-class-test additional-class-test error-class-test'}
  `(
    'getClassesList should return $expected when additionalClass: $additionalClass and errorClass: $errorClass',
    ({ additionalClass, errorClass, expected }) => {
      const received = getClassesList(
        mainClassMock,
        additionalClass,
        errorClass
      );

      expect(received).toBe(expected);
    }
  );

  it.each`
    users            | searchValue  | expected
    ${[] as IUser[]} | ${'test'}    | ${[]}
    ${usersMock}     | ${undefined} | ${usersMock}
    ${usersMock}     | ${'P'}       | ${[usersMock[0]]}
    ${usersMock}     | ${'@p'}      | ${[usersMock[0]]}
    ${usersMock}     | ${'j'}       | ${[usersMock[1]]}
    ${usersMock}     | ${'b'}       | ${[usersMock[1]]}
    ${usersMock}     | ${'M'}       | ${[]}
  `(
    'getSearch should return $expected when users: $users and searchValue: $searchValue',
    ({ users, searchValue, expected }) => {
      const received = getSearch(users, searchValue);

      expect(received).toStrictEqual(expected);
    }
  );

  it.each`
    inputValues                                        | expected
    ${{}}                                              | ${validationErrorMock}
    ${{ name: filledFieldsMock.name }}                 | ${{ role: translation.chooseRole, telegramName: translation.enterTelegramName }}
    ${{ telegramName: filledFieldsMock.telegramName }} | ${{ role: translation.chooseRole, name: translation.enterName }}
    ${{ role: filledFieldsMock.role }}                 | ${{ telegramName: translation.enterTelegramName, name: translation.enterName }}
    ${{ ...filledFieldsMock, name: veryLongNameMock }} | ${{ name: translation.nameTooLong }}
  `(
    'validateUserValues should return correct result for inputValues: $inputValues',
    ({ inputValues, expected }) => {
      const received = validateUserValues(inputValues);

      expect(received).toStrictEqual(expected);
    }
  );

  it.each`
    inputValues                               | expected
    ${{ telegramName: '@test' }}              | ${{ telegramName: translation.telegramNameTooShort }}
    ${{ telegramName: veryLongTelegramName }} | ${{ telegramName: translation.telegramNameTooLong }}
    ${{ telegramName: 'test_test' }}          | ${{ telegramName: translation.telegramNameIncorrect }}
    ${{ telegramName: '@test@' }}             | ${{ telegramName: translation.telegramNameIncorrect }}
    ${{ telegramName: '@test#' }}             | ${{ telegramName: translation.telegramNameIncorrect }}
    ${{ telegramName: '@test$' }}             | ${{ telegramName: translation.telegramNameIncorrect }}
    ${{ telegramName: '@test%' }}             | ${{ telegramName: translation.telegramNameIncorrect }}
    ${{ telegramName: '@test!' }}             | ${{ telegramName: translation.telegramNameIncorrect }}
    ${{ telegramName: '@test%' }}             | ${{ telegramName: translation.telegramNameIncorrect }}
    ${{ telegramName: '@test^' }}             | ${{ telegramName: translation.telegramNameIncorrect }}
    ${{ telegramName: '@test&' }}             | ${{ telegramName: translation.telegramNameIncorrect }}
    ${{ telegramName: '@test*' }}             | ${{ telegramName: translation.telegramNameIncorrect }}
    ${{ telegramName: '@test(' }}             | ${{ telegramName: translation.telegramNameIncorrect }}
    ${{ telegramName: '@test)' }}             | ${{ telegramName: translation.telegramNameIncorrect }}
  `(
    'validateUserValues (telegramName) should return correct result for inputValues: $inputValues',
    ({ inputValues, expected }) => {
      const received = validateUserValues({ ...filledFieldsMock, ...inputValues });

      expect(received).toStrictEqual(expected);
    }
  );

  it.each`
    user                                                | expected
    ${undefined}                                        | ${false}
    ${{} as IUser}                                      | ${false}
    ${{ ...usersMock[0], status: UserStatus.Inactive }} | ${false}
    ${{ ...usersMock[1] }}                              | ${false}
    ${usersMock[0]}                                     | ${usersMock[0].role}
    ${{ ...usersMock[1], status: UserStatus.Active }}   | ${usersMock[1].role}
  `(
    'checkUserAuthorization should return $expected when user: $user',
    async ({ user, expected }) => {
      const received = checkUserAuthorization(user);

      expect(received).toStrictEqual(expected);
    }
  );

  it('showElement should show element', () => {
    render(<Notification />);

    const notificationElement = screen.getByTestId('notification-test-id');

    showElement(notificationElement, 'Test Message');

    const style = window.getComputedStyle(notificationElement);

    expect(style.opacity).toBe('1');
    expect(style.zIndex).toBe('100');
  });

  it('hideElement should hide element', () => {
    render(<Notification />);

    const notificationElement = screen.getByTestId('notification-test-id');

    hideElement(notificationElement);

    const style = window.getComputedStyle(notificationElement);

    expect(style.opacity).toBe('');
    expect(style.zIndex).toBe('');
  });
});
