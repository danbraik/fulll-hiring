import type { FleetRepository } from "../../../../domain/repositories/FleetRepository";
import type { VehiculeRepository } from "../../../../domain/repositories/VehiculeRepository";
import type { Location } from "../../../../domain/valueObjects/Location";
import { Result } from "../../../../shared/Result";
import { getRegisteredVehicleOrFail } from "../../shared/handlerHelpers";
import type { GetVehicleLocationQuery } from "./GetVehicleLocationQuery";

export class GetVehicleLocationQueryHandler {
    constructor(
        private readonly fleetRepository: FleetRepository,
        private readonly vehiculeRepository: VehiculeRepository,
    ) {}

    async handle(
        query: GetVehicleLocationQuery,
    ): Promise<Result<Location | null, Error>> {
        const registeredVehicleResult = await getRegisteredVehicleOrFail(
            this.fleetRepository,
            this.vehiculeRepository,
            query.fleetId,
            query.plateNumber,
        );
        if (registeredVehicleResult.isFailure) {
            return Result.fail(registeredVehicleResult.error);
        }

        const { vehicule } = registeredVehicleResult.getValue();
        return Result.ok(vehicule.getLocation());
    }
}
