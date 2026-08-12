# Fleet Management

TypeScript implementation of a small fleet-management domain.

The project models two main user actions:

- register a vehicle in a fleet
- park a registered vehicle at a location

Behavior is specified with Cucumber feature tests and implemented with a simple application/domain/infrastructure split.

## Requirements

- Node.js
- Yarn

Dependencies are installed from `package.json`. You do not need a global TypeScript or Cucumber installation.

## Install

```bash
yarn install
```

## Run

Run the full test suite:

```bash
yarn test
```

This script:

1. builds the TypeScript project with `tsc`
2. runs the Cucumber scenarios

Build only:

```bash
yarn build
```

## CLI Usage

The project includes a small CLI exposed through the root `fleet` script.

You can run it either with:

```bash
./fleet <command>
```

or:

```bash
yarn fleet <command>
```

Available commands:

```bash
./fleet create <userId>
./fleet register-vehicle <fleetId> <vehiclePlateNumber>
./fleet localize-vehicle <fleetId> <vehiclePlateNumber> <lat> <lng> [alt]
```

Examples:

```bash
./fleet create user-1
./fleet register-vehicle <fleetId> AA-123-AA
./fleet localize-vehicle <fleetId> AA-123-AA 48.8566 2.3522
./fleet localize-vehicle <fleetId> AA-123-AA 48.8566 2.3522 35
```

CLI behavior:

- `create` prints the generated fleet id.
- `register-vehicle` and `localize-vehicle` produce no output on success.
- Invalid input or business-rule failures are written to stderr and return exit code `1`.
- The CLI uses `fleet.sqlite` by default.
- Set `FLEET_DATABASE_PATH` to use another SQLite file.

Example:

```bash
FLEET_DATABASE_PATH=/tmp/fleet.sqlite ./fleet create user-1
```

## Project Structure

```text
src/
  app/          Application use cases: commands and queries
  domain/       Entities, value objects, and repository contracts
  infra/        In-memory repository implementations
  shared/       Shared utilities such as Result

features/       Cucumber features and step definitions
```

## Domain Rules

The current implementation enforces these rules:

- A fleet belongs to one user.
- A fleet cannot register the same vehicle twice.
- The same vehicle can belong to multiple fleets.
- A vehicle can be parked only if it is already registered in the target fleet.
- Parking a vehicle twice in exactly the same location returns an error.

## Design Notes

### Result pattern

Application and domain operations return a `Result` instead of throwing for expected business errors. This keeps command/query handlers explicit about success and failure paths.

### In-memory repositories

The repository implementations under `src/infra/repositories/` simulate persistence in memory for tests and local execution.

They store and return fresh entity instances instead of sharing object references. That avoids tests passing only because multiple parts of the system accidentally mutate the same in-memory object.

### Fleet aggregate

`Fleet` stores registered vehicle ids as an array and exposes defensive reads:

- `hasVehicle()` compares ids by value
- `getVehicleIds()` returns a copy, not the internal array

This keeps the aggregate boundary simple and prevents external mutation.

### Location interpretation

I was not sure about the location: is it related to a vehicle only or to a relation fleet-vehicle?
We need to discuss with people to understand the create and create new test scenario.
For now, I decided to attach a location to a vehicle because a vehicle can be parked at only place at the same time.

### Location equality

`Location.equals()` compares latitude, longitude, and altitude.

In practice, this means two locations are considered equal only when all stored coordinates match, including altitude only when both are present.

### Database

For this exercise, the CLI uses SQLite through `better-sqlite3` and persists data in a local file. That keeps setup minimal while still exercising a real SQL-backed repository implementation.

### Transaction boundary

Registering a vehicle may require writing both the vehicle and the fleet. In a production implementation, these writes should share one transaction boundary, for example through an application-level unit of work coordinating both repositories. A dedicated repository for the registration operation would also be a pragmatic alternative. The current exercise keeps these repositories independent to avoid adding infrastructure complexity.

### Testing on database

For the test suite, `TestingWorld` starts with in-memory repositories and switches tagged scenarios to an in-memory SQLite database. The handlers are initialized lazily so the same world can swap repository implementations cleanly between test modes.


## Tested Scenarios

The feature suite currently covers:

- registering a vehicle into a fleet
- preventing duplicate registration in the same fleet
- allowing the same vehicle to be shared across multiple fleets
- parking a registered vehicle
- preventing parking the same vehicle twice in the same location

See:

- `features/register_vehicle.feature`
- `features/park_vehicle.feature`

## Tooling

- TypeScript for implementation
- Cucumber for behavior tests
- Biome is configured in `biome.json`


## Code quality

-We are using biome to format and linter. It replaces ESLint and Prettier.
-we are using strict Typescript in tsconfig.json
-we can add unit tests with vitest (native support of TS)
-we can check code coverage with vitest too
-to keep our Clean Architecture codebase and prevent regression, we can use a tool to check file dependencies as @archlinter/cli
-check 'npm audit' regularly 
-check dependency updates regularly (dependabot workflow)

## CI/CD workflow

- We suppose we want to deploy the CLI tool as an npm package
- so, we can add a Github Action for example to run:
  - git repository checkout
  - dependencies installation
  - npm audit
  - check code format
  - checking lint & types
  - for a PostgreSQL database: 
    - running a testing database service
    - running migrations
  - running build
  - running feature tests
  - running tests & coverage
  - publish coverage report
  - publish source maps on third services (Sentry for example)
  - if we are on main branch:
    - add a git tag for the new release
    - publish the npm package


# Step 3 subjects

## Code quality strategy
 

- **Biome** is used for formatting and static analysis. It replaces ESLint and Prettier in this project, reducing configuration and execution time.
- **TypeScript strict mode** is enabled to detect type inconsistencies at compile time.
- **Cucumber scenarios** remain the executable specification of the expected business behavior.
- **Vitest** may complement BDD tests with focused and fast unit tests for domain invariants, value objects and application handlers.
- **`@vitest/coverage-v8`** can identify insufficiently tested areas. Coverage is treated as a diagnostic metric, not as a quality objective by itself.
- Architectural dependency rules should ensure that:
  - Domain does not depend on App or Infra;
  - App does not depend on concrete infrastructure;
  - Infra implements ports defined by the inner layers.

  These rules can be automated with a tool such as dependency-cruiser. The chosen tool should only be introduced if the rules are
  configured and enforced in CI.
- `npm audit` detects known dependency vulnerabilities. Dependency updates and security alerts can be automated with Github Dependabot.
- Dependencies and Node.js versions should be pinned through the lockfile and the project configuration to make builds reproducible.
- Environment variables are documented in `.env.example`; secrets are never committed.
- The same validation command should run locally and in CI to avoid differences between developer and pipeline environments.


## CI strategy

 
1. Check out the repository.
2. Set up the pinned Node.js version and use the npm cache.
3. Install dependencies with `npm ci`.
4. Run Biome checks.
5. Run TypeScript type checking.
6. Validate architectural dependency rules.
7. Run unit and BDD tests against in-memory repositories.
8. Build the CLI.
9. Start an isolated PostgreSQL service.
10. Apply migrations to an empty database.
11. Run PostgreSQL integration scenarios.
12. Optionally upload coverage and test reports.
13. Run Code Quality tools like SonarQube.
14. Run IA agents to check that global enterprise patterns are respected.

Fast checks and PostgreSQL integration tests may run as separate parallel jobs.
Publication must remain impossible if any required quality gate fails.

## CD and release strategy

Assuming the CLI is distributed through npm, publication should be handled by a separate release workflow rather than by the pull-request workflow.

- Use semantic versioning and publish only from a protected version tag.
- Build and test the package once, then publish the validated artifact instead of rebuilding different content during the release job.
- Generate release notes or a changelog from the released changes.
- Verify the package contents before publication with `npm pack --dry-run`.
- Protect the release environment and require approval when appropriate.
- Publish prerelease versions under a dedicated npm tag when needed.

## Quality gates

A pull request can be merged only when:

- formatting, linting and type checking pass;
- unit, BDD and integration tests pass;
- architectural rules are respected;
- the application builds successfully;
- no unacceptable security vulnerability is introduced;
- required reviews have been approved.
 