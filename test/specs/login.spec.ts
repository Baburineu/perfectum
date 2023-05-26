import LoginPage from '../pageobjects/login.page.ts'
import { faker } from '@faker-js/faker';

describe('Login page', () => {
  const userEmail = process.env.TEST_USER
  const userPassword = process.env.PASSWORD

  it('User with valid credentials should be able to login [TC-1]', async () => {
    await LoginPage.open()
    await LoginPage.login(userEmail, userPassword);
    await LoginPage.verifyURL()
    await LoginPage.logOut()
  });

  it('User with empty or invalid credentials should not be able to login [TC-2]', async () => {
    const unregisteredUser = {
      email: `User${faker.string.alphanumeric(5)}@gmail.com`,
      password: `pass${faker.string.alphanumeric(8)}`
    }

    await LoginPage.open()
    await LoginPage.login('', unregisteredUser.password)
    await LoginPage.verifyTooltipText('Електронна пошта обовʼязкове поле.')
    await LoginPage.login(unregisteredUser.email, '')
    await LoginPage.verifyTooltipText('Пароль обовʼязкове поле.')
    await LoginPage.login('invalidEmail', unregisteredUser.password)
    await LoginPage.verifyTooltipText('Електронна пошта поле повинно містити коректну адресу електронної пошти.')
    await LoginPage.login(unregisteredUser.email, unregisteredUser.password)
    await LoginPage.verifyTooltipText('Невірна адреса електронної пошти або пароль')
  });

  afterEach('Refresh page', async() => {
    await browser.deleteAllCookies();
    await browser.refresh();
  });
})
