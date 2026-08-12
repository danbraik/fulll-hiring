import type { FleetRepository } from "../../../../domain/repositories/FleetRepository";
import type { VehicleRepository } from "../../../../domain/repositories/VehicleRepository";
import type { Location } from "../../../../domain/valueObjects/Location";
import { Result } from "../../../../shared/Result";
import { getRegisteredVehicleOrFail } from "../../shared/handlerHelpers";
import type { GetVehicleLocationQuery } from "./GetVehicleLocationQuery";

export class GetVehicleLocationQueryHandler {
    constructor(
        private readonly fleetRepository: FleetRepository,
        private readonly vehicleRepository: VehicleRepository,
    ) {}

    async handle(
        query: GetVehicleLocationQuery,
    ): Promise<Result<Location | null, Error>> {
        const registeredVehicleResult = await getRegisteredVehicleOrFail(
            this.fleetRepository,
            this.vehicleRepository,
            query.fleetId,
            query.plateNumber,
        );
        if (registeredVehicleResult.isFailure) {
            return Result.fail(registeredVehicleResult.error);
        }

        const { vehicle } = registeredVehicleResult.getValue();
        return Result.ok(vehicle.getLocation());
    }
}
