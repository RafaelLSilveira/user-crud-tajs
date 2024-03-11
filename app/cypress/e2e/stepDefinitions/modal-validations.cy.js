import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "../common/registerForm.cy.js";

Then("I should't see create modal on the screen", () => {
    registerForm.elements.modal().should('not.be.visible')
})
Then('The inputs should be cleared', () => {
    registerForm.elements.newNameInput().should('have.value', '')
    registerForm.elements.newAgeInput().should('have.value', '')
    registerForm.elements.newPhoneInput().should('have.value', '')
    registerForm.elements.newEmailInput().should('have.value', '')
    registerForm.elements.newVehicleInput().should('have.value', '')
})