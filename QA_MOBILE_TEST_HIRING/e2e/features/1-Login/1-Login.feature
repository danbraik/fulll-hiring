@domain:authentication
Feature: Login
  As a user
  I want to authenticate with my credentials
  So that I can reach the secure area

  Background:
    Given I am on the Login page

  @priority:core @smoke
  Scenario: Successful login with valid credentials
    When I log in as the valid user
    Then I should land on the Secure Area page
    And I should see the success banner "You logged into a secure area!"

  @priority:regression
  Scenario Outline: Rejected login with invalid credentials
    When I log in with username "<username>" and password "<password>"
    Then I should remain on the Login page
    And I should see the error banner "Your username is invalid!"

    Examples:
      | username    | password      | message                   |
      | invaliduser | invalidpass   | Your username is invalid! |
      | tomsmith    | wrongpassword | Your username is invalid! |

  @priority:core
  Scenario: Login page shows heading and instructions
    Then I should see the page heading "Login Page"
    And I should see the login instructions

  @priority:regression
  Scenario: Valid login shows the welcome banner
    When I log in as the valid user
    Then I should land on the Secure Area page
    And I should see the success banner "Welcome to the secure area!"

  @priority:regression
  Scenario: Returning user signs in with their usual password
    When I log in with username "tomsmith" and password "Summer2024!"
    Then I should land on the Secure Area page
