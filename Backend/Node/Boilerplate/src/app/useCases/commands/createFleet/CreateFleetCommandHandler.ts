import { Fleet } from "../../../../domain/entities/Fleet";
import { FleetRepository } from "../../../../domain/repositories/FleetRepository";
import { FleetId } from "../../../../domain/valueObjects/FleetId";
import { UserId } from "../../../../domain/valueObjects/UserId";
import { Result } from "../../../../shared/Result";
import { CreateFleetCommand } from "./CreateFleetCommand";

export class CreateFleetCommandHandler {
    constructor(private readonly fleetRepository: FleetRepository) {}

    async handle(command: CreateFleetCommand): Promise<Result<Fleet>> {
        const fleetId = FleetId.generate();
        const ownerId = UserId.create(command.userId);
        const fleet = Fleet.create(fleetId, ownerId);

        const saveResult = await this.fleetRepository.save(fleet);

        if (saveResult.isFailure) {
            return Result.fail(saveResult.error);
        }

        return Result.ok(fleet);
    }
}
