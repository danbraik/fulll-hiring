import { World, type IWorldOptions } from "@cucumber/cucumber";
import type { FleetRepository } from "../../src/domain/repositories/FleetRepository";
import { InMemoryFleetRepository } from "../../src/infra/repositories/InMemoryFleetRepository";
import type { Fleet } from "../../src/domain/entities/Fleet";
import { CreateFleetCommandHandler } from "../../src/app/useCases/commands/createFleet/CreateFleetCommandHandler";
import type { Vehicule } from "../../src/domain/entities/Vehicule";
import type { VehiculeRepository } from "../../src/domain/repositories/VehiculeRepository";
import { InMemoryVehiculeRepository } from "../../src/infra/repositories/InMemoryVehiculeRepository";
import { CreateVehiculeCommandHandler } from "../../src/app/useCases/commands/createVehicule/CreateVehiculeCommandHandler";
import { RegisterVehiculeCommandHandler } from "../../src/app/useCases/commands/registerVehicule/RegisterVehiculeCommandHandler";
import { ParkMyVehicleCommandHandler } from "../../src/app/useCases/commands/parkMyVehicle/ParkMyVehicleCommandHandler";
import { GetVehicleLocationQueryHandler } from "../../src/app/useCases/queries/getVehicleLocation/GetVehicleLocationQueryHandler";
import { IsVehicleRegisteredQueryHandler } from "../../src/app/useCases/queries/isVehicleRegistered/IsVehicleRegisteredQueryHandler";
import type { Result } from "../../src/shared/Result";
import type { Location } from "../../src/domain/valueObjects/Location";

export class TestingWorld extends World {
    fleetRepository: FleetRepository;
    vehiculeRepository: VehiculeRepository;

    createFleetCommandHandler: CreateFleetCommandHandler;
    createVehiculeCommandHandler: CreateVehiculeCommandHandler;
    registerVehiculeCommandHandler: RegisterVehiculeCommandHandler;
    parkMyVehicleCommandHandler: ParkMyVehicleCommandHandler;

    getVehicleLocationQueryHandler: GetVehicleLocationQueryHandler;
    isVehicleRegisteredQueryHandler: IsVehicleRegisteredQueryHandler;

    myFleet?: Fleet;
    otherFleet?: Fleet;
    myVehicule?: Vehicule;
    aLocation?: Location;

    lastRegisterVehiculeResult?: Result<void, Error>;
    lastParkMyVehicleResult?: Result<void, Error>;

    constructor(options: IWorldOptions<any>) {
        super(options);
        this.fleetRepository = new InMemoryFleetRepository();
        this.vehiculeRepository = new InMemoryVehiculeRepository();

        this.createFleetCommandHandler = new CreateFleetCommandHandler(
            this.fleetRepository,
        );
        this.createVehiculeCommandHandler = new CreateVehiculeCommandHandler(
            this.vehiculeRepository,
        );
        this.registerVehiculeCommandHandler =
            new RegisterVehiculeCommandHandler(
                this.fleetRepository,
                this.vehiculeRepository,
            );
        this.parkMyVehicleCommandHandler = new ParkMyVehicleCommandHandler(
            this.fleetRepository,
            this.vehiculeRepository,
        );
        this.getVehicleLocationQueryHandler =
            new GetVehicleLocationQueryHandler(
                this.fleetRepository,
                this.vehiculeRepository,
            );

        this.isVehicleRegisteredQueryHandler =
            new IsVehicleRegisteredQueryHandler(
                this.fleetRepository,
                this.vehiculeRepository,
            );
    }
}
