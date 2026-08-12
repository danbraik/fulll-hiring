import { World, type IWorldOptions } from "@cucumber/cucumber";
import type { FleetRepository } from "../../src/domain/repositories/FleetRepository";
import { InMemoryFleetRepository } from "../../src/infra/repositories/InMemoryFleetRepository";
import type { Fleet } from "../../src/domain/entities/Fleet";
import { CreateFleetCommandHandler } from "../../src/app/useCases/commands/createFleet/CreateFleetCommandHandler";
import type { Vehicle } from "../../src/domain/entities/Vehicle";
import type { VehicleRepository } from "../../src/domain/repositories/VehicleRepository";
import { InMemoryVehicleRepository } from "../../src/infra/repositories/InMemoryVehicleRepository";
import { CreateVehicleCommandHandler } from "../../src/app/useCases/commands/createVehicle/CreateVehicleCommandHandler";
import { RegisterVehicleCommandHandler } from "../../src/app/useCases/commands/registerVehicle/RegisterVehicleCommandHandler";
import { ParkMyVehicleCommandHandler } from "../../src/app/useCases/commands/parkMyVehicle/ParkMyVehicleCommandHandler";
import { GetVehicleLocationQueryHandler } from "../../src/app/useCases/queries/getVehicleLocation/GetVehicleLocationQueryHandler";
import { IsVehicleRegisteredQueryHandler } from "../../src/app/useCases/queries/isVehicleRegistered/IsVehicleRegisteredQueryHandler";
import type { Result } from "../../src/shared/Result";
import type { Location } from "../../src/domain/valueObjects/Location";

export class TestingWorld extends World {
    fleetRepository: FleetRepository;
    vehicleRepository: VehicleRepository;

    createFleetCommandHandler: CreateFleetCommandHandler;
    createVehicleCommandHandler: CreateVehicleCommandHandler;
    registerVehicleCommandHandler: RegisterVehicleCommandHandler;
    parkMyVehicleCommandHandler: ParkMyVehicleCommandHandler;

    getVehicleLocationQueryHandler: GetVehicleLocationQueryHandler;
    isVehicleRegisteredQueryHandler: IsVehicleRegisteredQueryHandler;

    myFleet?: Fleet;
    otherFleet?: Fleet;
    myVehicle?: Vehicle;
    aLocation?: Location;

    lastRegisterVehicleResult?: Result<void, Error>;
    lastParkMyVehicleResult?: Result<void, Error>;

    constructor(options: IWorldOptions<any>) {
        super(options);
        this.fleetRepository = new InMemoryFleetRepository();
        this.vehicleRepository = new InMemoryVehicleRepository();

        this.createFleetCommandHandler = new CreateFleetCommandHandler(
            this.fleetRepository,
        );
        this.createVehicleCommandHandler = new CreateVehicleCommandHandler(
            this.vehicleRepository,
        );
        this.registerVehicleCommandHandler = new RegisterVehicleCommandHandler(
            this.fleetRepository,
            this.vehicleRepository,
        );
        this.parkMyVehicleCommandHandler = new ParkMyVehicleCommandHandler(
            this.fleetRepository,
            this.vehicleRepository,
        );
        this.getVehicleLocationQueryHandler =
            new GetVehicleLocationQueryHandler(
                this.fleetRepository,
                this.vehicleRepository,
            );

        this.isVehicleRegisteredQueryHandler =
            new IsVehicleRegisteredQueryHandler(
                this.fleetRepository,
                this.vehicleRepository,
            );
    }
}
