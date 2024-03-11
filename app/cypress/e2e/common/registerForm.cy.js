class RegisterForm {
    elements = {
        userTable: () => cy.get('#table'),
        modal: () => cy.get('#create-modal'),
        filterInput: () => cy.get('#filter'),
        searchButton: () => cy.get('#btnSearch'),
        clearButton: () => cy.get('#btnClear'),
        newUserButton: () => cy.get('#btnNewUser'),
        removeButton: () => cy.get('#btnRemove'),
        editButton: () => cy.get('#btnEdit'),
        newNameInput: () => cy.get('#new-name'),
        newAgeInput: () => cy.get('#new-age'),
        newEmailInput: () => cy.get('#new-email'),
        newPhoneInput: () => cy.get('#new-phone'),
        newVehicleInput: () => cy.get('#new-vehicle'),
        submitButton: () => cy.get('#btnSubmit'),
        cancelButton: () => cy.get('#btnCancel'),
    }

    typeFilter(text) {
        if(!text) return
        this.elements.filterInput().clear()
        this.elements.filterInput().type(text)
    }

    clickSearch() {
        this.elements.searchButton().click()
    }

    clickClear() {
        this.elements.clearButton().click()
    }

    clickNewUserButton() {
        this.elements.newUserButton().click()
    }

    clickRemoveButton() {
        this.elements.removeButton().trigger('click')
    }

    clickEditButton() {
        this.elements.editButton().click()
    }

    typeNewName(text) {
        if(!text) return
        this.elements.newNameInput().clear()
        this.elements.newNameInput().type(text)
    }

    typeNewAge(text) {
        if(!text) return
        this.elements.newAgeInput().clear()
        this.elements.newAgeInput().type(text)
    }

    typeNewEmail(text) {
        if(!text) return
        this.elements.newEmailInput().clear()
        this.elements.newEmailInput().type(text)
    }

    typeNewPhone(text) {
        if(!text) return
        this.elements.newPhoneInput().clear()
        this.elements.newPhoneInput().type(text)
    }

    typeNewVehicle(text) {
        if(!text) return
        this.elements.newVehicleInput().clear()
        this.elements.newVehicleInput().type(text)
    }

    clickSubmit(){
        this.elements.submitButton().trigger('click')
    }

    clickCancel(){
        this.elements.cancelButton().click()
    }

}

export const registerForm = new RegisterForm()