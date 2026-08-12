import type { FleetRepository } from "../../../../domain/repositories/FleetRepository";
import type { VehiculeRepository } from "../../../../domain/repositories/VehiculeRepository";
import { FleetId } from "../../../../domain/valueObjects/FleetId";
import { PlateNumber } from "../../../../domain/valueObjects/PlateNumber";
import { Result } from "../../../../shared/Result";
import { FleetNotFoundError } from "../../shared/handlerHelpers";
import type { IsVehicleRegisteredQuery } from "./IsVehicleRegisteredQuery";

export class IsVehicleRegisteredQueryHandler {
    constructor(
        private readonly fleetRepository: FleetRepository,
        private readonly vehiculeRepository: VehiculeRepository,
    ) {}

    async handle(
        query: IsVehicleRegisteredQuery,
    ): Promise<Result<boolean, Error>> {
        const fleetResult = await this.fleetRepository.findById(
            FleetId.create(query.fleetId),
        );
        if (fleetResult.isFailure) {
            return Result.fail(fleetResult.error);
        }

        const fleet = fleetResult.getValue();
        if (!fleet) {
            return Result.fail(new FleetNotFoundError());
        }

        const vehiculeResult = await this.vehiculeRepository.findByPlateNumber(
            PlateNumber.create(query.plateNumber),
        );
        if (vehiculeResult.isFailure) {
            return Result.fail(vehiculeResult.error);
        }

        const vehicule = vehiculeResult.getValue();
        if (!vehicule) {
            return Result.ok(false);
        }

        const isRegistered = fleet.hasVehicule(vehicule.getId());

        return Result.ok(isRegistered);
    }
}
