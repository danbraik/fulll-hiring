import { Result } from "../../shared/Result";
import type { FleetId } from "../valueObjects/FleetId";
import type { UserId } from "../valueObjects/UserId";
import type { VehicleId } from "../valueObjects/VehicleId";

export class AlreadyRegisteredVehicleError extends Error {}

export class Fleet {
    private constructor(
        private readonly id: FleetId,
        private readonly ownerId: UserId,
        private vehicleIds: VehicleId[],
    ) {}

    getId(): FleetId {
        return this.id;
    }

    getOwnerId(): UserId {
        return this.ownerId;
    }

    getVehicleIds(): VehicleId[] {
        return [...this.vehicleIds];
    }

    hasVehicle(vehicleId: VehicleId): boolean {
        return this.vehicleIds.some((fleetVehicleId) =>
            fleetVehicleId.equals(vehicleId),
        );
    }

    addVehicle(vehicleId: VehicleId): Result<void> {
        if (this.hasVehicle(vehicleId)) {
            return Result.fail(new AlreadyRegisteredVehicleError());
        }

        this.vehicleIds.push(vehicleId);
        return Result.ok(undefined);
    }

    static create(
        id: FleetId,
        ownerId: UserId,
        vehicleIds: VehicleId[] = [],
    ): Fleet {
        return new Fleet(id, ownerId, [...vehicleIds]);
    }
}
