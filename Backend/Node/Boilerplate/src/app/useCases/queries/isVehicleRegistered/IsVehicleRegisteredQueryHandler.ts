import type { FleetRepository } from "../../../../domain/repositories/FleetRepository";
import type { VehicleRepository } from "../../../../domain/repositories/VehicleRepository";
import { FleetId } from "../../../../domain/valueObjects/FleetId";
import { PlateNumber } from "../../../../domain/valueObjects/PlateNumber";
import { Result } from "../../../../shared/Result";
import { FleetNotFoundError } from "../../shared/handlerHelpers";
import type { IsVehicleRegisteredQuery } from "./IsVehicleRegisteredQuery";

export class IsVehicleRegisteredQueryHandler {
    constructor(
        private readonly fleetRepository: FleetRepository,
        private readonly vehicleRepository: VehicleRepository,
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

        const vehicleResult = await this.vehicleRepository.findByPlateNumber(
            PlateNumber.create(query.plateNumber),
        );
        if (vehicleResult.isFailure) {
            return Result.fail(vehicleResult.error);
        }

        const vehicle = vehicleResult.getValue();
        if (!vehicle) {
            return Result.ok(false);
        }

        const isRegistered = fleet.hasVehicle(vehicle.getId());

        return Result.ok(isRegistered);
    }
}
