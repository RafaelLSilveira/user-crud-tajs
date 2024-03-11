Feature: User Report

  Scenario: Cancel create a user
    Given I am on the user registration page
    When I click the new user button
    Then I enter "Mary Doe Vandame" in the name field
    Then I enter "30" in the age field
    Then I enter "mary.doe@yahoo.com.br" in the email field
    Then I enter "55 9999-9999" in the phone field
    Then I enter "Biz" in the vehicle field
    Then I click the cancel button
    Then I should't see create modal on the screen
    And I should't see "Mary Doe Vandame" name on the user list

  Scenario: Creating an user
    Given I am on the user registration page
    When I click the new user button
    Then The inputs should be cleared
    Then I enter "John Doe Vandame" in the name field
    Then I enter "30" in the age field
    Then I enter "john.doe@yahoo.com.br" in the email field
    Then I enter "55 9999-9999" in the phone field
    Then I enter "Honda 125" in the vehicle field
    Then I click the submit button
    Then I should't see create modal on the screen
    And I should see "John Doe Vandame" name on the user list

  Scenario: Searching an user
    Given I am on the user registration page
    When I enter "John Doe Vandame" in the search field
    Then I click the search button
    Then I should see "John Doe Vandame" name on the user list
    And I should see only 1 register on the user list

  Scenario: Clear search an user
    Given I am on the user registration page
    When I enter "John Doe Vandame" in the search field
    Then I click the search button
    Then I should see "John Doe Vandame" name on the user list
    Then I should see only 1 register on the user list  
    Then I click the clean search 
    And I should see search field empty 

  Scenario: Editing an user
    Given I am on the user registration page
    When I enter "John Doe Vandame" in the search field
    Then I click the search button
    Then I click the edit button
    Then I enter "John D. Vandame" in the name field
    Then I click the submit button
    Then I should't see create modal on the screen
    And I should see "John D. Vandame" name on the user list

  Scenario: Deleting an user
    Given I am on the user registration page
    When I enter "John D. Vandame" in the search field
    Then I click the search button
    Then I click the delete button
    And I should't see "John D. Vandame" name on the user list
