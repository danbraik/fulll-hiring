import { Command } from "commander";
import { CreateFleetCommand } from "../../app/useCases/commands/createFleet/CreateFleetCommand";
import { CreateFleetCommandHandler } from "../../app/useCases/commands/createFleet/CreateFleetCommandHandler";
import { ParkMyVehicleCommand } from "../../app/useCases/commands/parkMyVehicle/ParkMyVehicleCommand";
import { ParkMyVehicleCommandHandler } from "../../app/useCases/commands/parkMyVehicle/ParkMyVehicleCommandHandler";
import { RegisterVehicleCommand } from "../../app/useCases/commands/registerVehicle/RegisterVehicleCommand";
import { RegisterVehicleCommandHandler } from "../../app/useCases/commands/registerVehicle/RegisterVehicleCommandHandler";
import { GetVehicleLocationQueryHandler } from "../../app/useCases/queries/getVehicleLocation/GetVehicleLocationQueryHandler";
import { IsVehicleRegisteredQuery } from "../../app/useCases/queries/isVehicleRegistered/IsVehicleRegisteredQuery";
import { IsVehicleRegisteredQueryHandler } from "../../app/useCases/queries/isVehicleRegistered/IsVehicleRegisteredQueryHandler";
import type { Result } from "../../shared/Result";
import { initializeDatabase } from "../database/initialize";
import { SqlFleetRepository } from "../repositories/SqlFleetRepository";
import { SqlVehicleRepository } from "../repositories/SqlVehicleRepository";

const database = initializeDatabase();
const fleetRepository = new SqlFleetRepository(database);
const vehicleRepository = new SqlVehicleRepository(database);

const createFleetCommandHandler = new CreateFleetCommandHandler(
    fleetRepository,
);
const registerVehicleCommandHandler = new RegisterVehicleCommandHandler(
    fleetRepository,
    vehicleRepository,
);
const parkMyVehicleCommandHandler = new ParkMyVehicleCommandHandler(
    fleetRepository,
    vehicleRepository,
);
const isVehicleRegisteredQueryHandler = new IsVehicleRegisteredQueryHandler(
    fleetRepository,
    vehicleRepository,
);
const getVehicleLocationQueryHandler = new GetVehicleLocationQueryHandler(
    fleetRepository,
    vehicleRepository,
);

function unwrapResult<T>(result: Result<T, Error>): T {
    if (result.isFailure) {
        throw result.error;
    }

    return result.getValue();
}

function parseCoordinate(value: string, label: string): number {
    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
        throw new Error(`${label} must be a valid number`);
    }

    return parsedValue;
}

function formatError(error: unknown): string {
    if (error instanceof Error) {
        if (error.message.trim().length > 0) {
            return error.message;
        }

        if (error.name.trim().length > 0) {
            return error.name;
        }
    }

    return String(error);
}

const program = new Command();

program.name("fleet");

program
    .command("create")
    .argument("<userId>")
    .description("Create a fleet for a user")
    .action(async (userId: string) => {
        const fleet = unwrapResult(
            await createFleetCommandHandler.handle(
                new CreateFleetCommand(userId),
            ),
        );

        process.stdout.write(`${fleet.getId().toString()}\n`);
    });

program
    .command("register-vehicle")
    .argument("<fleetId>")
    .argument("<vehiclePlateNumber>")
    .description("Register a vehicle in a fleet")
    .action(async (fleetId: string, vehiclePlateNumber: string) => {
        unwrapResult(
            await registerVehicleCommandHandler.handle(
                new RegisterVehicleCommand(fleetId, vehiclePlateNumber),
            ),
        );

        const isRegistered = unwrapResult(
            await isVehicleRegisteredQueryHandler.handle(
                new IsVehicleRegisteredQuery(fleetId, vehiclePlateNumber),
            ),
        );

        if (!isRegistered) {
            throw new Error("Vehicle registration verification failed");
        }
    });

program
    .command("localize-vehicle")
    .argument("<fleetId>")
    .argument("<vehiclePlateNumber>")
    .argument("<lat>")
    .argument("<lng>")
    .argument("[alt]")
    .description("Set a vehicle location in a fleet")
    .action(
        async (
            fleetId: string,
            vehiclePlateNumber: string,
            lat: string,
            lng: string,
            alt?: string,
        ) => {
            const latitude = parseCoordinate(lat, "lat");
            const longitude = parseCoordinate(lng, "lng");
            const altitude =
                alt === undefined ? undefined : parseCoordinate(alt, "alt");

            unwrapResult(
                await parkMyVehicleCommandHandler.handle(
                    new ParkMyVehicleCommand(fleetId, vehiclePlateNumber, {
                        latitude,
                        longitude,
                        altitude,
                    }),
                ),
            );
        },
    );

program.parseAsync(process.argv).catch((error: unknown) => {
    process.stderr.write(`${formatError(error)}\n`);
    process.exitCode = 1;
});
