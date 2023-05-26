class ModalComponent {
    public get closeModalButton() {
        return $(`div[id="stock_item-modal"] button[aria-label="Close"] span`);
    }

    public modalTitle(titleText) {
        return $(`//div[@class="modal-header"]//h4[contains(.,"${titleText}")]`);
    }

    async closeModalWindow() {
        await this.closeModalButton.waitForClickable();
        await this.closeModalButton.moveTo();
        await this.closeModalButton.click();
        await this.closeModalButton.waitForDisplayed({reverse: true});
    }

    async verifyModalTitle(modalTitle) {
        await this.modalTitle(modalTitle).waitForDisplayed();
        await expect(this.modalTitle(modalTitle)).toHaveTextContaining(modalTitle)
    }

}

export default new ModalComponent();