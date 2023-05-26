import {ChainablePromiseElement} from 'webdriverio';
import Page from './page.ts';
import Modal from './components/modal.component.ts';

class MainPage extends Page {
    private get searchInput() {
        return $('#search-form__input');
    }

    private get catalogButton() {
        return $('.mh-catalog-btn');
    }

    private get searchButton() {
        return $('button.search-form__submit-button');
    }

    public get searchResults() {
        return $$('.product-card__title');
    }

    public get filtersSection() {
        return $$('.filters');
    }

    public get addToCartButton() {
        return $$('.buy-button');
    }

    public get goToCartButton() {
        return $$('.go-cart');
    }

    public openAndVerifyURL(path?) {
        return super.openAndVerifyURL(path);
    }

    public productCard(itemName: string) {
        return `//div[@class = 'product-card'][contains(normalize-space(),'${itemName}')]//a[@class='product-card__title']`;
    }

    async openProductBasket() {
        await $(`div.mh-cart`).waitForClickable();
        await $(`div.mh-cart`).click();
    }

    async searchItem(itemName: string) {
        await this.searchInput.setValue(itemName);
        await this.searchButton.click();
    }

    async verifySearchResults(itemName) {
        await expect(this.searchResults).toBeExisting()
        console.log(`Number of search results: ${await this.searchResults.length}`.toUpperCase());
        await expect(this.searchResults).toHaveTextContaining(new RegExp(itemName, 'i'));
    }

    async navigateToCategory(category, subcategory?) {
        if(subcategory) {
            const categoryLink = await $(`//a[@class='mm__a'][normalize-space()='${category}']`);
            await categoryLink.moveTo();
            const subcategoryLink = await categoryLink.$(`//..//a[@class='mm__a3'][normalize-space()='${subcategory}']`);
            await subcategoryLink.waitForClickable();
            await subcategoryLink.click();
        } else {
            const categoryLink = await $(`//a[@class='mm__a'][normalize-space()='${category}']`);
            await categoryLink.waitForClickable();
            await categoryLink.click();
        }
    }

    async selectFilterByPrice(minPrice, maxPrice) {
        const minPriceInput = await $(`//input[@class='f-range__form-input'][1]`);
        await minPriceInput.waitForClickable();
        await minPriceInput.setValue(minPrice);
        const maxPriceInput = await $(`//input[@class='f-range__form-input'][2]`);
        await maxPriceInput.setValue(maxPrice);
        const submitButton = await $('.f-popup__btn');
        await submitButton.click();
    }

    async selectFilterBySectionAndType(filterOptions) {
        for (const key in filterOptions) {
            const element = await $(`//h3[text()='${key}']//..//..`);
            await element.scrollIntoView({block: 'center', inline: 'center'});
            const classAttributeValue = await element.getAttribute('class');
            const hasActiveClass = classAttributeValue.includes('active');
            if (!hasActiveClass) {
                await element.click();
            }
            const filterCheckbox = await $(`//h3[text()='${key}']//..//..//a[@class='f-check'][starts-with(normalize-space(text()), '${filterOptions[key]}')]`);
            await filterCheckbox.scrollIntoView({block: 'center', inline: 'center'});
            await filterCheckbox.click();
            const submitButton = await $('.f-popup__btn');
            await submitButton.click();
        }
    }

    async verifyPriceFilterApplied(minPrice, maxPrice) {
        const priceTags = await $$(`div.discount span.sum`);
        for (let i = 0; i < priceTags.length; i++) {
            const price = parseInt(await priceTags[i].getText().replace(/\D/g, ''));
            if (price < minPrice || price > maxPrice) {
                return false;
            }
        }
        return true;
    }

    async selectSortBy(sortBy) {
        const sortByCurrent = $('.sort-by__current')
        const sortBySelect = await $('.sort-by__select');
        console.log('Current sort', await sortByCurrent.getText());
        if(!(await sortByCurrent.getText() === sortBy)) {
            await browser.waitUntil(async () => sortBySelect.isClickable(), {
                timeout: 10000,
                timeoutMsg: 'Select element did not become clickable within 5 seconds',
            });
            await sortBySelect.moveTo();
            const sortByItem = await $(`//li[text()='${sortBy}']`);
            await sortByItem.click();
        }
    }

    async verifyItemsSortedByPrice() {
        const itemsPriceTags = await $$(`div.discount span.sum`);
        let itemsPrices = [];
        for (let i = 0; i < itemsPriceTags.length; i++) {
            const price = parseInt(await itemsPriceTags[i].getText().replace(/\D/g, ''));
            itemsPrices.push(price);
        }
        return itemsPrices.every((price, i) => i === 0 || price >= itemsPrices[i - 1]);
    }

    async openCatalog() {
        await this.catalogButton.waitForClickable();
        await this.catalogButton.click();
    }

    async openProductPage(productName) {
        await browser.waitUntil(async () => $(this.productCard(productName)).isClickable(), {
            timeout: 5000,
            timeoutMsg: 'Select element did not become clickable within 5 seconds',
        });
        await $(this.productCard(productName)).click();
    }

    async addItemToBasket(itemName) {
        const addToBasketButton = await $(`${this.productCard(itemName)}//..//button[@class='v-btn--cart']`);
        await addToBasketButton.waitForClickable();
        await addToBasketButton.click();
    }

    async getNumberItemsInBasket() {
        await $(`.products__list>li`).waitForDisplayed();
        const numberItems = await $$(`.products__list>li`);
        return await numberItems.length
    }

    async verifyBasketItemCount(itemsAddedToBasket) {
        const basketCount = await $(`span.c-counter__text`);
        await basketCount.waitForDisplayed();
        const basketCountNumber = parseInt(await basketCount.getText(), 10);
        this.openProductBasket()
        const actualCount = await this.getNumberItemsInBasket();
        expect(await basketCountNumber).toEqual(await actualCount) ;
        expect(await actualCount).toEqual(itemsAddedToBasket) ;
    }

    async verifyBasketItemInfo(expectedBasketItemInfo) {
        const actualBasketInfo = [];
        const productNames = await $$(`//div[@class='title']//span`);
        const productQuantities = await $$(`li .input`);
        const productPrices = await $$(`li div.price-box__cur`);

        await productNames[1].waitForDisplayed();
        for (let i = 0; i < productNames.length; i++) {
            const productName = await productNames[i].getText();
            const productQuantity = parseInt(await productQuantities[i].getValue());
            const productPriceText = await productPrices[i].getText();
            const productPrice = parseInt(await productPriceText.replace(/\D/g, ''), 10);
            actualBasketInfo.push([productName, productQuantity, productPrice]);
        }
        expect(actualBasketInfo).toEqual(expectedBasketItemInfo)
    }

    async verifyBasketTotalPrice() {
        const totalPriceElement = await $(`.cart-popup__content .total-box__price`);
        await totalPriceElement.waitForDisplayed();
        const totalPriceText = await totalPriceElement.getText();
        const actualTotalPrice = parseInt(await totalPriceText.replace(/\D/g, ''), 10);
        const productPrices = await $$(`div.price-box__cur`);

        let expectedTotalPrice = 0;
        for (let productPrice of productPrices) {
            let priceText = await productPrice.getText()
            expectedTotalPrice += parseInt(await priceText.replace(/\D/g, ''), 10);
        }
        expect(await expectedTotalPrice === actualTotalPrice).toBeTruthy();
    }

    async verifyBasketDeleteButton(productName) {
        const productInBasket = await $(`//div[@class='product-item__wrap']//span[contains(text(),'${productName}')]`);
        const deleteButtonOfProduct = await $(`//div[@class='product-item__wrap']//span[contains(text(),'${productName}')]//ancestor::div[@class='title']//*[@xmlns]`);

        await deleteButtonOfProduct.waitForDisplayed();
        await deleteButtonOfProduct.scrollIntoView();
        expect(await deleteButtonOfProduct).toBeClickable()
        await deleteButtonOfProduct.click();
        await deleteButtonOfProduct.waitForDisplayed({reverse: true});
        expect(await deleteButtonOfProduct.isDisplayed()).toBeFalsy()
        expect(await productInBasket.isDisplayed()).toBeFalsy()
    }
}

export default new MainPage();
