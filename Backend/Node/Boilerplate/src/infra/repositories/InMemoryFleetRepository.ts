import { Fleet } from "../../domain/entities/Fleet";
import type { FleetRepository } from "../../domain/repositories/FleetRepository";
import type { FleetId } from "../../domain/valueObjects/FleetId";
import { Result } from "../../shared/Result";

export class InMemoryFleetRepository implements FleetRepository {
    private readonly fleets = new Map<string, Fleet>();

    async save(fleet: Fleet): Promise<Result<void, Error>> {
        const fleetKey = fleet.getId().toString();

        this.fleets.set(
            fleetKey,
            Fleet.create(
                fleet.getId(),
                fleet.getOwnerId(),
                fleet.getVehicleIds(),
            ),
        );

        return Result.ok(undefined);
    }

    async findById(fleetId: FleetId): Promise<Result<Fleet | null, Error>> {
        const fleet = this.fleets.get(fleetId.toString());

        if (!fleet) {
            return Result.ok(null);
        }

        return Result.ok(
            Fleet.create(
                fleet.getId(),
                fleet.getOwnerId(),
                fleet.getVehicleIds(),
            ),
        );
    }
}
