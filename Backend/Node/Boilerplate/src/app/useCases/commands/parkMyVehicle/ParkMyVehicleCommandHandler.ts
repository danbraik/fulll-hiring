import type { FleetRepository } from "../../../../domain/repositories/FleetRepository";
import type { VehiculeRepository } from "../../../../domain/repositories/VehiculeRepository";
import { FleetId } from "../../../../domain/valueObjects/FleetId";
import { Location } from "../../../../domain/valueObjects/Location";
import { PlateNumber } from "../../../../domain/valueObjects/PlateNumber";
import { Result } from "../../../../shared/Result";
import { FleetNotFoundError } from "../registerVehicule/RegisterVehiculeCommandHandler";
import type { ParkMyVehicleCommand } from "./ParkMyVehicleCommand";

export class VehicleNotRegisteredInFleetError extends Error {}

export class VehicleAlreadyParkedAtLocationError extends Error {}

export class ParkMyVehicleCommandHandler {
    constructor(
        private readonly fleetRepository: FleetRepository,
        private readonly vehiculeRepository: VehiculeRepository,
    ) {}

    async handle(command: ParkMyVehicleCommand): Promise<Result<void, Error>> {
        const fleetResult = await this.fleetRepository.findById(
            FleetId.create(command.fleetId),
        );
        if (fleetResult.isFailure) {
            return Result.fail(fleetResult.error);
        }

        const fleet = fleetResult.getValue();
        if (!fleet) {
            return Result.fail(new FleetNotFoundError());
        }

        const vehiculeResult = await this.vehiculeRepository.findByPlateNumber(
            PlateNumber.create(command.plateNumber),
        );
        if (vehiculeResult.isFailure) {
            return Result.fail(vehiculeResult.error);
        }

        const vehicule = vehiculeResult.getValue();
        if (!vehicule || !fleet.hasVehicule(vehicule.getId())) {
            return Result.fail(new VehicleNotRegisteredInFleetError());
        }

        const location = Location.create(
            command.location.latitude,
            command.location.longitude,
            command.location.altitude,
        );
        const currentLocation = vehicule.getLocation();
        if (currentLocation?.equals(location)) {
            return Result.fail(new VehicleAlreadyParkedAtLocationError());
        }

        vehicule.setLocation(location);

        const saveVehiculeResult = await this.vehiculeRepository.save(vehicule);
        if (saveVehiculeResult.isFailure) {
            return Result.fail(saveVehiculeResult.error);
        }

        return Result.ok(undefined);
    }
}
