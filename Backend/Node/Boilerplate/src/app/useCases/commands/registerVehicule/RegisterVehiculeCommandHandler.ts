import { Fleet } from '../../../../domain/entities/Fleet';
import { Vehicule } from '../../../../domain/entities/Vehicule';
import { FleetRepository } from '../../../../domain/repositories/FleetRepository';
import { VehiculeRepository } from '../../../../domain/repositories/VehiculeRepository';
import { FleetId } from '../../../../domain/valueObjects/FleetId';
import { PlateNumber } from '../../../../domain/valueObjects/PlateNumber';
import { VehiculeId } from '../../../../domain/valueObjects/VehiculeId';
import { Result } from '../../../../shared/Result';
import { RegisterVehiculeCommand } from './RegisterVehiculeCommand';

export class FleetNotFoundError extends Error { }

export class RegisterVehiculeCommandHandler {
  constructor(
    private readonly fleetRepository: FleetRepository,
    private readonly vehiculeRepository: VehiculeRepository,
  ) { }

  async handle(command: RegisterVehiculeCommand): Promise<Result<void, Error>> {
    const fleetResult = await this.fleetRepository.findById(FleetId.create(command.fleetId));
    if (fleetResult.isFailure) {
      return Result.fail(fleetResult.error);
    }

    const fleet = fleetResult.getValue();
    if (!fleet) {
      return Result.fail(new FleetNotFoundError());
    }

    const plateNumber = PlateNumber.create(command.plateNumber);
    const vehiculeResult = await this.vehiculeRepository.findByPlateNumber(plateNumber);
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

      const saveVehiculeResult = await this.vehiculeRepository.save(vehicule);
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
