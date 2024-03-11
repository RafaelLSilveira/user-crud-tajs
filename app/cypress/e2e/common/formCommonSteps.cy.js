import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "./registerForm.cy.js";

Given('I am on the user registration page', () => {
  cy.visit('/ui')
  cy.wait(1000)
})
When('I click the new user button', () => {
  registerForm.clickNewUserButton()
  cy.wait(500)
}) 
Then('I enter {string} in the name field', (text) => {
  registerForm.typeNewName(text)
})
Then('I enter {string} in the age field', (text) => {
  registerForm.typeNewAge(text)
})
Then('I enter {string} in the email field', (text) => {
  registerForm.typeNewEmail(text)
})
Then('I enter {string} in the phone field', (text) => {
  registerForm.typeNewPhone(text)
})
Then('I enter {string} in the vehicle field', (text) => {
  registerForm.typeNewVehicle(text)
})
Then('I click the submit button', () => {
  registerForm.clickSubmit()
})
Then('I click the cancel button', () => {
  registerForm.clickCancel()
})
Then('I enter {string} in the search field', (text) => {
  registerForm.typeFilter(text)
})
Then('I click the search button', () => {
  registerForm.clickSearch()
})
Then('I click the edit button', () => {
  registerForm.clickEditButton()
})
Then('I click the delete button', () => {
  registerForm.clickRemoveButton()
})
Then('I click the clean search', () => {
  registerForm.clickClear()
})
Then('I should see search field empty', () => {
  registerForm.elements.filterInput().should('be.empty')
})