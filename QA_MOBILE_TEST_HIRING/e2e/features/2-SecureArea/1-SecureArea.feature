@domain:authentication
Feature: Secure Area
  As an authenticated user
  I want to see the secure area and be able to log out
  So that I can end my session safely

  Background:
    Given I am logged in as the valid user

  @priority:core
  Scenario: Secure area shows all expected elements
    Then I should see the Secure Area heading
    And I should see the Secure Area welcome message
    And I should see the logout button

  @priority:core @smoke
  Scenario: Logging out returns to the Login page with a confirmation
    When I tap the element with id "logout-button"
    Then the element with id "success-logout-text" should exist
    And the element with id "success-logout-text" should have text "You logged out of the secure area!"

  @priority:regression
  Scenario: Secure area exposes the title element
    Then the element with id "secure-area-title" should exist
