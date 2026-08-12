import { Vehicule } from "../../../../domain/entities/Vehicule";
import type { VehiculeRepository } from "../../../../domain/repositories/VehiculeRepository";
import { PlateNumber } from "../../../../domain/valueObjects/PlateNumber";
import { VehiculeId } from "../../../../domain/valueObjects/VehiculeId";
import { Result } from "../../../../shared/Result";
import type { CreateVehiculeCommand } from "./CreateVehiculeCommand";

export class CreateVehiculeCommandHandler {
    constructor(private readonly vehiculeRepository: VehiculeRepository) {}

    async handle(command: CreateVehiculeCommand): Promise<Result<Vehicule>> {
        const vehicule = Vehicule.create(
            VehiculeId.generate(),
            PlateNumber.create(command.plateNumber),
            null,
        );

        const saveResult = await this.vehiculeRepository.save(vehicule);
        if (saveResult.isFailure) {
            return Result.fail(saveResult.error);
        }

        return Result.ok(vehicule);
    }
}
