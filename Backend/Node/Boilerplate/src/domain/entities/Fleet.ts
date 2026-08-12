import { Result } from "../../shared/Result";
import type { FleetId } from "../valueObjects/FleetId";
import type { UserId } from "../valueObjects/UserId";
import type { VehiculeId } from "../valueObjects/VehiculeId";

export class AlreadyRegisteredVehiculeError extends Error {}

export class Fleet {
    private constructor(
        private readonly id: FleetId,
        private readonly ownerId: UserId,
        private vehiculeIds: VehiculeId[],
    ) {}

    getId(): FleetId {
        return this.id;
    }

    getOwnerId(): UserId {
        return this.ownerId;
    }

    getVehiculeIds(): VehiculeId[] {
        return [...this.vehiculeIds];
    }

    hasVehicule(vehiculeId: VehiculeId): boolean {
        return this.vehiculeIds.some((fleetVehiculeId) =>
            fleetVehiculeId.equals(vehiculeId),
        );
    }

    addVehicule(vehiculeId: VehiculeId): Result<void> {
        if (this.hasVehicule(vehiculeId)) {
            return Result.fail(new AlreadyRegisteredVehiculeError());
        }

        this.vehiculeIds.push(vehiculeId);
        return Result.ok(undefined);
    }

    static create(
        id: FleetId,
        ownerId: UserId,
        vehiculeIds: VehiculeId[] = [],
    ): Fleet {
        return new Fleet(id, ownerId, [...vehiculeIds]);
    }
}
