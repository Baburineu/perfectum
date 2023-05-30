import Page from './page.ts';
import Modal from './components/modal.component.ts';
import {faker} from "@faker-js/faker";

class StockPage extends Page {
    private get tradeMenuDropdown() {
        return $(`//li[@id="horizontal-menu-divider-als-trade"]`);
    }

    private tradeSubmenuDropdown(submenu) {
        return $(`//li[@id="horizontal-menu-divider-als-trade"]//ul[ @class="submenu"]//li//span[contains(text(), '${submenu}')]`);
    }

    private get addNewStockItemButton() {
        return $('a[onclick="init_stock_item(); return false;"]');
    }

    private get modalTitle() {
        return $('//div[@class="modal-content data"]//h4[@id="myModalLabel"]');
    }

    private get stockItemSubmit() {
        return $('#stock-item-form-submit');
    }

    private get searchInputInTheStockTable() {
        return $('.dataTables_filter input');
    }

    private get searchButtonInTheStockTable() {
        return $('.input-group-prepend');
    }

    private stockItemNameInTable(stockItemName) {
        return `//a[normalize-space()="${stockItemName}"]`;
    }

    private stockItemNameDeleteButton() {
        return $(`.row-options ._delete`);
    }

    private stockItemNameEditButton() {
        return $(`.row-options a[onclick^="init_stock_item"]`);
    }



    public openAndVerifyURL(path?) {
        return super.openAndVerifyURL(path);
    }

    async openMenuDropdownAndSelectSubmenu(submenu) {
        await this.tradeMenuDropdown.waitForDisplayed({timeout: 50000})
        await this.tradeMenuDropdown.moveTo()
        await this.tradeSubmenuDropdown(submenu).click()
    }

    async openAddNewStockItem() {
        await this.addNewStockItemButton.click()
    }

    async addNewStockItem(parameters: {}) {
        await this.addNewStockItemButton.click()
        await this.modalTitle.waitForDisplayed({timeout: 30000})
        for (const key of Object.keys(parameters)) {
            if (key == 'Категорія' || key == 'Постачальник'|| key == 'Одиниці виміру') {
                const basePath = await $(`//div[@class="tab-content"]//label[text()='${key}']/../div`);
                await basePath.scrollIntoView({block: 'center', inline: 'center'});
                await basePath.click()
                const option = await $(`//div[@class="dropdown-menu show"]//span[(text()='${parameters[key]}')]`)
                await option.waitForDisplayed({timeout: 30000})
                await option.click()
            } else {
                const input = await $(`//div[@class="tab-content"]//label[text()='${key}']/../input`);
                await input.scrollIntoView({block: 'center', inline: 'center'});
                await input.setValue(parameters[key]);
            }
        }
        await this.stockItemSubmit.scrollIntoView({block: 'center', inline: 'center'});
        await this.stockItemSubmit.click()
        await Modal.modalTitle("Новий товар").waitForDisplayed({timeout:20000, reverse: true});
        return this;
    }

    async verifyStockItemInfoInModal(stockItemData: {}) {
        await Modal.verifyModalTitle(stockItemData['Назва'])
        for (const label of Object.keys(stockItemData)) {
           if(!stockItemData['Назва']) {
               await expect($(`//p[text()="${label}"]/following-sibling::p[1]`)).toHaveText(stockItemData[label])
           }
        }
        return this;
    }

    public async searchStockItem(searchRequest: string) {
        await this.searchInputInTheStockTable.waitForDisplayed();
        await this.searchInputInTheStockTable.setValue(searchRequest);
        await this.searchButtonInTheStockTable.click();
    }

    public async foundStockTableHeaders() {
        const tableHeadersSelector = await $$(`th[rowspan="1"]`);
        const foundHeaders = [];
        for (const tableHeaderElement of tableHeadersSelector) {
           await tableHeaderElement.getText().then(foundHeader => {
                foundHeaders.push(foundHeader);
            });
        }
        return await foundHeaders
    }

    async verifyTableCellValueInTheColumn(
        columnName: string,
        rowNumber: number,
        expectedValue: string,
    ) {
        let found = false;
        await $(`tbody tr td`).waitForDisplayed({timeout: 20000})
        const foundHeaders = await this.foundStockTableHeaders();

        for (const [index, el] of foundHeaders.entries()) {
            if (el === columnName) {
                expect($$(`tbody tr`)[rowNumber - 1].$$(`tbody tr td`)[index]).toHaveTextContaining(expectedValue);
                found = true;
                break;
            }
        }

        if (!found) {
            throw new Error(`Table header '${columnName}' was not found`);
        }
        return this;
    }

    async verifyStockItemInfoInTable(stockItemData) {
        const stockTableColumns = [
            'Артикул',
            'Назва',
            'Категорія',
            'Штрихкод',
            'Ціна закупки',
            'Ціна продажу'
        ]

        for (const key in stockItemData) {
            if(stockTableColumns.includes(key)) {
                await this.verifyTableCellValueInTheColumn(key, 1, `${stockItemData[key]}`);
            }
        }
        return this;
    }

    async deleteStockItem(stockItemName) {
        await $(this.stockItemNameInTable(stockItemName)).waitForDisplayed({timeout: 30000})
        await $(this.stockItemNameInTable(stockItemName)).moveTo()
        await this.stockItemNameDeleteButton().waitForClickable()
        await this.stockItemNameDeleteButton().click()
        await browser.acceptAlert()
    }

    async editStockItem(stockItemName, parameters: {}) {
        await $(this.stockItemNameInTable(stockItemName)).waitForClickable()
        await $(this.stockItemNameInTable(stockItemName)).moveTo()
        await this.stockItemNameEditButton().waitForClickable({timeout: 20000})
        await this.stockItemNameEditButton().click()

        await this.modalTitle.waitForDisplayed()
        for (const key of Object.keys(parameters)) {
            if (key == 'Категорія' || key == 'Постачальник'|| key == 'Одиниці виміру') {
                const basePath = await $(`//div[@class="tab-content"]//label[text()='${key}']/../div`);
                await basePath.scrollIntoView({block: 'center', inline: 'center'});
                await basePath.click()
                const option = await $(`//div[@class="dropdown-menu show"]//span[(text()='${parameters[key]}')]`)
                await option.click()
            } else {
                const input = await $(`//div[@class="tab-content"]//label[text()='${key}']/../input`);
                await input.scrollIntoView({block: 'center', inline: 'center'});
                await input.setValue(parameters[key]);
            }
        }
        await this.stockItemSubmit.scrollIntoView({block: 'center', inline: 'center'});
        await this.stockItemSubmit.click()
        return this;

        return this;
    }

    async checkStockItemIsPresent(stockItemName, displayed= true) {
        const stockItemInTable = await $(`//td/a[contains(text(),"${stockItemName}")]`)
        await stockItemInTable.waitForDisplayed({timeout: 20000, reverse: !displayed})

        if(displayed){
            await expect(await stockItemInTable).toBeDisplayed()
        } else await expect(await stockItemInTable).not.toBeDisplayed()
        return this;
    }
}

export default new StockPage();
