import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "../common/registerForm.cy.js";

Then('I should see {string} name on the user list', (value) => {
  registerForm.elements.userTable().contains('td', value).should('be.visible')
})
Then("I should't see {string} name on the user list", (value) => {
  registerForm.elements.userTable().filter('td', value).should('have.length', 0)
})
Then("I should see only 1 register on the user list", () => {
  cy.get("#table > tbody").children().should('have.length', 1)
})