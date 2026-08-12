import { FleetRepository } from "../../../../domain/repositories/FleetRepository";
import { VehiculeRepository } from "../../../../domain/repositories/VehiculeRepository";
import { Location } from "../../../../domain/valueObjects/Location";
import { FleetId } from "../../../../domain/valueObjects/FleetId";
import { PlateNumber } from "../../../../domain/valueObjects/PlateNumber";
import { Result } from "../../../../shared/Result";
import { FleetNotFoundError } from "../../commands/registerVehicule/RegisterVehiculeCommandHandler";
import { GetVehicleLocationQuery } from "./GetVehicleLocationQuery";

export class VehicleNotRegisteredInFleetError extends Error {}

export class GetVehicleLocationQueryHandler {
    constructor(
        private readonly fleetRepository: FleetRepository,
        private readonly vehiculeRepository: VehiculeRepository,
    ) {}

    async handle(
        query: GetVehicleLocationQuery,
    ): Promise<Result<Location | null, Error>> {
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
        if (!vehicule || !fleet.hasVehicule(vehicule.getId())) {
            return Result.fail(new VehicleNotRegisteredInFleetError());
        }

        return Result.ok(vehicule.getLocation());
    }
}
