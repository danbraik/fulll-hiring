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

### Location equality

`Location.equals()` compares latitude, longitude, and altitude.

In practice, this means two locations are considered equal only when all stored coordinates match, including altitude when present.

### Database

For this exercise, the CLI uses SQLite through `better-sqlite3` and persists data in a local file. That keeps setup minimal while still exercising a real SQL-backed repository implementation.

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
