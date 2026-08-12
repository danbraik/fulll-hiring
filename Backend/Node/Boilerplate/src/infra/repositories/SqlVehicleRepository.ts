import type Database from "better-sqlite3";
import { Vehicle } from "../../domain/entities/Vehicle";
import type { VehicleRepository } from "../../domain/repositories/VehicleRepository";
import { Location } from "../../domain/valueObjects/Location";
import { PlateNumber } from "../../domain/valueObjects/PlateNumber";
import { VehicleId } from "../../domain/valueObjects/VehicleId";
import { Result } from "../../shared/Result";

type VehicleRow = {
    id: string;
    plate_number: string;
    location_latitude: number | null;
    location_longitude: number | null;
    location_altitude: number | null;
};

type UpsertVehicleParameters = {
    id: string;
    plateNumber: string;
    locationLatitude: number | null;
    locationLongitude: number | null;
    locationAltitude: number | null;
};

function toError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
}

function mapVehicleRow(row: VehicleRow): Vehicle {
    const latitude = row.location_latitude;
    const longitude = row.location_longitude;

    const location =
        latitude !== null && longitude !== null
            ? Location.create(latitude, longitude, row.location_altitude)
            : null;

    return Vehicle.create(
        VehicleId.create(row.id),
        PlateNumber.create(row.plate_number),
        location,
    );
}

export class SqlVehicleRepository implements VehicleRepository {
    private readonly upsertVehicleStatement: Database.Statement<UpsertVehicleParameters>;
    private readonly findVehicleByIdStatement: Database.Statement<
        [string],
        VehicleRow
    >;
    private readonly findVehicleByPlateNumberStatement: Database.Statement<
        [string],
        VehicleRow
    >;
    private readonly saveTransaction: Database.Transaction<
        (vehicle: Vehicle) => void
    >;

    constructor(private readonly database: Database.Database) {
        this.upsertVehicleStatement = this.database.prepare(`
            INSERT INTO vehicles (
                id,
                plate_number,
                location_latitude,
                location_longitude,
                location_altitude
            )
            VALUES (
                @id,
                @plateNumber,
                @locationLatitude,
                @locationLongitude,
                @locationAltitude
            )
            ON CONFLICT(id) DO UPDATE
            SET
                plate_number = excluded.plate_number,
                location_latitude = excluded.location_latitude,
                location_longitude = excluded.location_longitude,
                location_altitude = excluded.location_altitude
        `);
        this.findVehicleByIdStatement = this.database.prepare(`
            SELECT
                id,
                plate_number,
                location_latitude,
                location_longitude,
                location_altitude
            FROM vehicles
            WHERE id = ?
        `);
        this.findVehicleByPlateNumberStatement = this.database.prepare(`
            SELECT
                id,
                plate_number,
                location_latitude,
                location_longitude,
                location_altitude
            FROM vehicles
            WHERE plate_number = ?
        `);

        this.saveTransaction = this.database.transaction((vehicle: Vehicle) => {
            const location = vehicle.getLocation();

            this.upsertVehicleStatement.run({
                id: vehicle.getId().toString(),
                plateNumber: vehicle.getPlateNumber().toString(),
                locationLatitude: location?.getLatitude() ?? null,
                locationLongitude: location?.getLongitude() ?? null,
                locationAltitude: location?.getAltitude() ?? null,
            });
        });
    }

    async save(vehicle: Vehicle): Promise<Result<void, Error>> {
        try {
            this.saveTransaction(vehicle);
            return Result.ok(undefined);
        } catch (error: unknown) {
            return Result.fail(toError(error));
        }
    }

    async findById(
        vehicleId: VehicleId,
    ): Promise<Result<Vehicle | null, Error>> {
        try {
            const row = this.findVehicleByIdStatement.get(
                vehicleId.toString(),
            ) as VehicleRow | undefined;

            if (!row) {
                return Result.ok(null);
            }

            return Result.ok(mapVehicleRow(row));
        } catch (error: unknown) {
            return Result.fail(toError(error));
        }
    }

    async findByPlateNumber(
        plateNumber: PlateNumber,
    ): Promise<Result<Vehicle | null, Error>> {
        try {
            const row = this.findVehicleByPlateNumberStatement.get(
                plateNumber.toString(),
            ) as VehicleRow | undefined;

            if (!row) {
                return Result.ok(null);
            }

            return Result.ok(mapVehicleRow(row));
        } catch (error: unknown) {
            return Result.fail(toError(error));
        }
    }
}
