import { World, IWorldOptions } from '@cucumber/cucumber';
import { FleetRepository } from '../../src/domain/repositories/FleetRepository';
import { InMemoryFleetRepository } from '../../src/infra/repositories/InMemoryFleetRepository';
import { Fleet } from '../../src/domain/entities/Fleet';
import { CreateFleetCommandHandler } from '../../src/app/useCases/commands/createFleet/CreateFleetCommandHandler';
import { Vehicule } from '../../src/domain/entities/Vehicule';
import { VehiculeRepository } from '../../src/domain/repositories/VehiculeRepository';
import { InMemoryVehiculeRepository } from '../../src/infra/repositories/InMemoryVehiculeRepository';
import { RegisterVehiculeCommandHandler } from '../../src/app/useCases/commands/registerVehicule/RegisterVehiculeCommandHandler';
import { ParkMyVehicleCommandHandler } from '../../src/app/useCases/commands/parkMyVehicle/ParkMyVehicleCommandHandler';
import { GetVehicleLocationQueryHandler } from '../../src/app/useCases/queries/getVehicleLocation/GetVehicleLocationQueryHandler';
import { IsVehicleRegisteredQueryHandler } from '../../src/app/useCases/queries/isVehicleRegistered/IsVehicleRegisteredQueryHandler';
import { Result } from '../../src/shared/Result';
import { Location } from '../../src/domain/valueObjects/Location';

export class TestingWorld extends World {
    fleetRepository: FleetRepository;
    vehiculeRepository: VehiculeRepository;

    createFleetCommandHandler: CreateFleetCommandHandler;
    registerVehiculeCommandHandler: RegisterVehiculeCommandHandler;
    parkMyVehicleCommandHandler: ParkMyVehicleCommandHandler;

    getVehicleLocationQueryHandler: GetVehicleLocationQueryHandler;
    isVehicleRegisteredQueryHandler: IsVehicleRegisteredQueryHandler;

    myFleet?: Fleet;
    otherFleet?: Fleet;
    myVehicule?: Vehicule;

    lastRegisterVehiculeResult?: Result<void, Error>;
    lastParkMyVehicleResult?: Result<void, Error>;

    aLocation?: Location;

    constructor(options: IWorldOptions<any>) {
        super(options);
        this.fleetRepository = new InMemoryFleetRepository();
        this.vehiculeRepository = new InMemoryVehiculeRepository();

        this.createFleetCommandHandler = new CreateFleetCommandHandler(this.fleetRepository);
        this.registerVehiculeCommandHandler = new RegisterVehiculeCommandHandler(
            this.fleetRepository,
            this.vehiculeRepository,
        );
        this.parkMyVehicleCommandHandler = new ParkMyVehicleCommandHandler(
            this.fleetRepository,
            this.vehiculeRepository,
        );
        this.getVehicleLocationQueryHandler = new GetVehicleLocationQueryHandler(
            this.fleetRepository,
            this.vehiculeRepository,
        );

        this.isVehicleRegisteredQueryHandler = new IsVehicleRegisteredQueryHandler(
            this.fleetRepository,
            this.vehiculeRepository,
        );
    }
}
