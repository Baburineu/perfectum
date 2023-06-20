import LoginPage from '../pageobjects/login.page.ts'
import StockPage from '../pageobjects/stock.page.ts'
import Modal from '../pageobjects/components/modal.component.ts';
import { faker } from '@faker-js/faker';

describe('Stock page', () => {

  beforeEach('Login as admin', () => {
    StockPage.open(process.env.BASE_URL)
    LoginPage.login(process.env.TEST_USER, process.env.PASSWORD);
  });

  it('Admin user should be able add a new product to the stock [TC-3]', async () => {
    /* Summary: “Admin user should be able add a new product”
       Move to the "Торгівля" -> "Склад"
       Click on the button "Новий товар"
       Fill in the  modal form
       Click on the button "Зберегти"
       Check notification
       Check product info
       Click on "Close modal"
       Find created product
       Verify created product data in Table
    */
      const stockItemData = {
          'Артикул': `${faker.number.int(1000)}`,
          'Назва': `testName-${faker.number.int()}`,
          'Категорія': `${faker.helpers.arrayElement(['Орігамі', 'Ресторан "Перфектум"', 'Печенье', 'оф.принадлежности'])}`,
          'Штрихкод': `${faker.number.int()}`,
          'Постачальник': `${faker.helpers.arrayElement(['Jysk', 'Lato'])}`,
          'Ціна закупки (у валюті постачальника)': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Собівартість': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Ціна закупки': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Ціна продажу': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Оптова':`${faker.number.float({max: 10000, precision: 0.01})}`,
          'Спеціальна': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Одиниці виміру': `${faker.helpers.arrayElement(['шт', 'кг', 'г', 'т'])}`,
      }

      await StockPage.openMenuDropdownAndSelectSubmenu('Склад')
      await StockPage.addNewStockItem(stockItemData)
      await StockPage.verifyNotification('Товар успішно додано')
      await StockPage.verifyStockItemInfoInModal(stockItemData)
      await Modal.closeModalWindow()
      await StockPage.searchStockItem(stockItemData['Назва'])
      await StockPage.verifyStockItemInfoInTable(stockItemData)
  });

  it('Admin user should be able to delete product from the stock [TC-4]', async () => {
      /* Summary: “Admin user should be able to delete product from the stock”
       Move to the "Торгівля" -> "Склад"
       Click on the button "Новий товар"
       Fill in the  modal form
       Click on the button "Зберегти"
       Check notification
       Check product info
       Click on "Close modal"
       Find created product
       Click on the Delete button
       Check that the product is not present
    */

      const stockItemData = {
          'Артикул': `${faker.number.int(1000)}`,
          'Назва': `testName-${faker.number.int()}`,
          'Категорія': `${faker.helpers.arrayElement(['Орігамі', 'Ресторан "Перфектум"', 'Печенье', 'оф.принадлежности'])}`,
          'Штрихкод': `${faker.number.int()}`,
          'Постачальник': `${faker.helpers.arrayElement(['Jysk', 'Lato'])}`,
          'Ціна закупки (у валюті постачальника)': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Собівартість': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Ціна закупки': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Ціна продажу': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Оптова':`${faker.number.float({max: 10000, precision: 0.01})}`,
          'Спеціальна': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Одиниці виміру': `${faker.helpers.arrayElement(['шт', 'кг', 'г', 'т'])}`,
      }

      await StockPage.openMenuDropdownAndSelectSubmenu('Склад')
      await StockPage.addNewStockItem(stockItemData)
      await StockPage.verifyNotification('Товар успішно додано')
      await StockPage.verifyStockItemInfoInModal(stockItemData)
      await Modal.closeModalWindow()
      await StockPage.searchStockItem(stockItemData['Назва'])
      await StockPage.deleteStockItem(stockItemData['Назва'])
      await StockPage.verifyNotification('Товар видалено')
      await StockPage.searchStockItem(stockItemData['Назва'])
      await StockPage.checkStockItemIsPresent(stockItemData['Назва'], false)
  });

  it('Admin user should be able to edit the product in the stock [TC-5]', async () => {
    /* Summary: “Admin user should be able to delete product from the stock”
       Move to the "Торгівля" -> "Склад"
       Click on the button "Новий товар"
       Fill in the  modal form
       Click on the button "Зберегти"
       Check notification
       Check product info
       Close modal window
       Find created product
       Click on the Edit button
       Edit the product data
       Click on the button "Зберегти"
       Check notification
       Close modal window
       Find edited product
       Verify edited product data in Table
    */

      const stockItemData = {
          'Артикул': `${faker.number.int(1000)}`,
          'Назва': `testName-${faker.number.int()}`,
          'Категорія': `${faker.helpers.arrayElement(['Орігамі', 'Ресторан "Перфектум"', 'Печенье', 'оф.принадлежности'])}`,
          'Штрихкод': `${faker.number.int()}`,
          'Постачальник': `${faker.helpers.arrayElement(['Jysk', 'Lato'])}`,
          'Ціна закупки (у валюті постачальника)': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Собівартість': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Ціна закупки': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Ціна продажу': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Оптова':`${faker.number.float({max: 10000, precision: 0.01})}`,
          'Спеціальна': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Одиниці виміру': `${faker.helpers.arrayElement(['шт', 'кг', 'г', 'т'])}`,
      }

      const editedStockItemData = {
          'Артикул': `${faker.number.int(1000)}`,
          'Назва': `testName-${faker.number.int()}`,
          'Категорія': `${faker.helpers.arrayElement(['Орігамі', 'Ресторан "Перфектум"', 'Печенье', 'оф.принадлежности'])}`,
          'Штрихкод': `${faker.number.int()}`,
          'Постачальник': `${faker.helpers.arrayElement(['Jysk', 'Lato'])}`,
          'Ціна закупки (у валюті постачальника)': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Собівартість': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Ціна закупки': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Ціна продажу': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Оптова':`${faker.number.float({max: 10000, precision: 0.01})}`,
          'Спеціальна': `${faker.number.float({max: 10000, precision: 0.01})}`,
          'Одиниці виміру': `${faker.helpers.arrayElement(['шт', 'кг', 'г', 'т'])}`,
      }

      await StockPage.openMenuDropdownAndSelectSubmenu('Склад')
      await StockPage.addNewStockItem(stockItemData)
      await StockPage.verifyNotification('Товар успішно додано')
      await Modal.closeModalWindow()
      await StockPage.searchStockItem(stockItemData['Назва'])
      await StockPage.editStockItem(stockItemData['Назва'], editedStockItemData)
      await StockPage.verifyNotification('Товар успішно оновлено')
      await StockPage.verifyStockItemInfoInModal(editedStockItemData)
      await Modal.closeModalWindow()
      await StockPage.searchStockItem(editedStockItemData['Назва'])
      await StockPage.verifyStockItemInfoInTable(editedStockItemData)
  });

  afterEach('Refresh page', async() => {
    await browser.deleteAllCookies();
    await browser.refresh();
  });
})
