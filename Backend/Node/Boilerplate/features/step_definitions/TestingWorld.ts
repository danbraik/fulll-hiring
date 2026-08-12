import { World, IWorldOptions } from '@cucumber/cucumber';
import { FleetRepository } from '../../src/domain/repositories/FleetRepository';
import { InMemoryFleetRepository } from '../../src/infra/repositories/InMemoryFleetRepository';
import { Fleet } from '../../src/domain/entities/Fleet';
import { CreateFleetCommandHandler } from '../../src/app/useCases/commands/createFleet/CreateFleetCommandHandler';
import { Vehicule } from '../../src/domain/entities/Vehicule';
import { VehiculeRepository } from '../../src/domain/repositories/VehiculeRepository';
import { InMemoryVehiculeRepository } from '../../src/infra/repositories/InMemoryVehiculeRepository';
import { RegisterVehiculeCommandHandler } from '../../src/app/useCases/commands/registerVehicule/RegisterVehiculeCommandHandler';

export class TestingWorld extends World {
    fleetRepository: FleetRepository;
    vehiculeRepository: VehiculeRepository;

    createFleetCommandHandler: CreateFleetCommandHandler;
    registerVehiculeCommandHandler: RegisterVehiculeCommandHandler;

    myFleet?: Fleet;
    myVehicule?: Vehicule;

    constructor(options: IWorldOptions<any>) {
        super(options);
        this.fleetRepository = new InMemoryFleetRepository();
        this.vehiculeRepository = new InMemoryVehiculeRepository();

        this.createFleetCommandHandler = new CreateFleetCommandHandler(this.fleetRepository);
        this.registerVehiculeCommandHandler = new RegisterVehiculeCommandHandler(
            this.fleetRepository,
            this.vehiculeRepository,
        );
    }
}
