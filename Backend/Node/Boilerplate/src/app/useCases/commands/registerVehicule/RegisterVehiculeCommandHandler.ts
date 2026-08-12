import { Vehicule } from "../../../../domain/entities/Vehicule";
import type { FleetRepository } from "../../../../domain/repositories/FleetRepository";
import type { VehiculeRepository } from "../../../../domain/repositories/VehiculeRepository";
import { PlateNumber } from "../../../../domain/valueObjects/PlateNumber";
import { VehiculeId } from "../../../../domain/valueObjects/VehiculeId";
import { Result } from "../../../../shared/Result";
import { getFleetOrFail } from "../../shared/handlerHelpers";
import type { RegisterVehiculeCommand } from "./RegisterVehiculeCommand";

export class RegisterVehiculeCommandHandler {
    constructor(
        private readonly fleetRepository: FleetRepository,
        private readonly vehiculeRepository: VehiculeRepository,
    ) {}

    async handle(
        command: RegisterVehiculeCommand,
    ): Promise<Result<void, Error>> {
        const fleetResult = await getFleetOrFail(
            this.fleetRepository,
            command.fleetId,
        );
        if (fleetResult.isFailure) {
            return Result.fail(fleetResult.error);
        }

        const fleet = fleetResult.getValue();

        const plateNumber = PlateNumber.create(command.plateNumber);
        const vehiculeResult =
            await this.vehiculeRepository.findByPlateNumber(plateNumber);
        if (vehiculeResult.isFailure) {
            return Result.fail(vehiculeResult.error);
        }

        let vehicule = vehiculeResult.getValue();
        if (!vehicule) {
            vehicule = Vehicule.create(
                VehiculeId.generate(),
                plateNumber,
                null,
            );

            const saveVehiculeResult =
                await this.vehiculeRepository.save(vehicule);
            if (saveVehiculeResult.isFailure) {
                return Result.fail(saveVehiculeResult.error);
            }
        }

        const addVehiculeResult = fleet.addVehicule(vehicule.getId());
        if (addVehiculeResult.isFailure) {
            return Result.fail(addVehiculeResult.error);
        }

        const saveFleetResult = await this.fleetRepository.save(fleet);
        if (saveFleetResult.isFailure) {
            return Result.fail(saveFleetResult.error);
        }

        return Result.ok(undefined);
    }
}
