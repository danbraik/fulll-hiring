import type Database from "better-sqlite3";
import { Fleet } from "../../domain/entities/Fleet";
import type { FleetRepository } from "../../domain/repositories/FleetRepository";
import { FleetId } from "../../domain/valueObjects/FleetId";
import { UserId } from "../../domain/valueObjects/UserId";
import { VehicleId } from "../../domain/valueObjects/VehicleId";
import { Result } from "../../shared/Result";

type FleetRow = {
    id: string;
    owner_id: string;
};

type FleetVehicleRow = {
    vehicle_id: string;
};

type UpsertFleetParameters = {
    id: string;
    ownerId: string;
};

type InsertFleetVehicleParameters = {
    fleetId: string;
    vehicleId: string;
};

function toError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
}

export class SqlFleetRepository implements FleetRepository {
    private readonly upsertFleetStatement: Database.Statement<UpsertFleetParameters>;
    private readonly insertFleetVehicleStatement: Database.Statement<InsertFleetVehicleParameters>;
    private readonly findFleetByIdStatement: Database.Statement<
        [string],
        FleetRow
    >;
    private readonly findFleetVehiclesByFleetIdStatement: Database.Statement<
        [string],
        FleetVehicleRow
    >;
    private readonly saveTransaction: Database.Transaction<
        (fleet: Fleet) => void
    >;

    constructor(private readonly database: Database.Database) {
        this.upsertFleetStatement = this.database.prepare(`
            INSERT INTO fleets (id, owner_id)
            VALUES (@id, @ownerId)
            ON CONFLICT(id) DO UPDATE
            SET owner_id = excluded.owner_id
        `);
        this.insertFleetVehicleStatement = this.database.prepare(`
            INSERT INTO fleet_vehicles (fleet_id, vehicle_id)
            VALUES (@fleetId, @vehicleId)
            ON CONFLICT (fleet_id, vehicle_id) DO NOTHING
        `);
        this.findFleetByIdStatement = this.database.prepare(`
            SELECT id, owner_id
            FROM fleets
            WHERE id = ?
        `);
        this.findFleetVehiclesByFleetIdStatement = this.database.prepare(`
            SELECT vehicle_id
            FROM fleet_vehicles
            WHERE fleet_id = ?
            ORDER BY vehicle_id ASC
        `);

        this.saveTransaction = this.database.transaction((fleet: Fleet) => {
            const fleetId = fleet.getId().toString();

            this.upsertFleetStatement.run({
                id: fleetId,
                ownerId: fleet.getOwnerId().toString(),
            });

            for (const vehicleId of fleet.getVehicleIds()) {
                this.insertFleetVehicleStatement.run({
                    fleetId,
                    vehicleId: vehicleId.toString(),
                });
            }
        });
    }

    async save(fleet: Fleet): Promise<Result<void, Error>> {
        try {
            this.saveTransaction(fleet);
            return Result.ok(undefined);
        } catch (error: unknown) {
            return Result.fail(toError(error));
        }
    }

    async findById(fleetId: FleetId): Promise<Result<Fleet | null, Error>> {
        try {
            const fleetRow = this.findFleetByIdStatement.get(
                fleetId.toString(),
            ) as FleetRow | undefined;

            if (!fleetRow) {
                return Result.ok(null);
            }

            const vehicleRows = this.findFleetVehiclesByFleetIdStatement.all(
                fleetId.toString(),
            ) as FleetVehicleRow[];

            const vehicleIds = vehicleRows.map((row) =>
                VehicleId.create(row.vehicle_id),
            );

            return Result.ok(
                Fleet.create(
                    FleetId.create(fleetRow.id),
                    UserId.create(fleetRow.owner_id),
                    vehicleIds,
                ),
            );
        } catch (error: unknown) {
            return Result.fail(toError(error));
        }
    }
}
