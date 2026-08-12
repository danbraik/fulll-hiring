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
import Database from "better-sqlite3";

export class TestingWorld extends World {
    fleetRepository: FleetRepository;
    vehicleRepository: VehicleRepository;

    private createFleetCommandHandler?: CreateFleetCommandHandler;
    private createVehicleCommandHandler?: CreateVehicleCommandHandler;
    private registerVehicleCommandHandler?: RegisterVehicleCommandHandler;
    private parkMyVehicleCommandHandler?: ParkMyVehicleCommandHandler;

    private getVehicleLocationQueryHandler?: GetVehicleLocationQueryHandler;
    private isVehicleRegisteredQueryHandler?: IsVehicleRegisteredQueryHandler;

    myFleet?: Fleet;
    otherFleet?: Fleet;
    myVehicle?: Vehicle;
    aLocation?: Location;

    lastRegisterVehicleResult?: Result<void, Error>;
    lastParkMyVehicleResult?: Result<void, Error>;

    database?: Database.Database;

    constructor(options: IWorldOptions<any>) {
        super(options);
        this.fleetRepository = new InMemoryFleetRepository();
        this.vehicleRepository = new InMemoryVehicleRepository();
    }

    public setRepositories(
        fleetRepository: FleetRepository,
        vehicleRepository: VehicleRepository,
    ): void {
        this.fleetRepository = fleetRepository;
        this.vehicleRepository = vehicleRepository;
        this.createFleetCommandHandler = undefined;
        this.createVehicleCommandHandler = undefined;
        this.registerVehicleCommandHandler = undefined;
        this.parkMyVehicleCommandHandler = undefined;
        this.getVehicleLocationQueryHandler = undefined;
        this.isVehicleRegisteredQueryHandler = undefined;
    }

    public getCreateFleetCommandHandler(): CreateFleetCommandHandler {
        if (!this.createFleetCommandHandler) {
            this.createFleetCommandHandler = new CreateFleetCommandHandler(
                this.fleetRepository,
            );
        }

        return this.createFleetCommandHandler;
    }

    public getCreateVehicleCommandHandler(): CreateVehicleCommandHandler {
        if (!this.createVehicleCommandHandler) {
            this.createVehicleCommandHandler = new CreateVehicleCommandHandler(
                this.vehicleRepository,
            );
        }

        return this.createVehicleCommandHandler;
    }

    public getRegisterVehicleCommandHandler(): RegisterVehicleCommandHandler {
        if (!this.registerVehicleCommandHandler) {
            this.registerVehicleCommandHandler =
                new RegisterVehicleCommandHandler(
                    this.fleetRepository,
                    this.vehicleRepository,
                );
        }

        return this.registerVehicleCommandHandler;
    }

    public getParkMyVehicleCommandHandler(): ParkMyVehicleCommandHandler {
        if (!this.parkMyVehicleCommandHandler) {
            this.parkMyVehicleCommandHandler = new ParkMyVehicleCommandHandler(
                this.fleetRepository,
                this.vehicleRepository,
            );
        }

        return this.parkMyVehicleCommandHandler;
    }

    public getGetVehicleLocationQueryHandler(): GetVehicleLocationQueryHandler {
        if (!this.getVehicleLocationQueryHandler) {
            this.getVehicleLocationQueryHandler =
                new GetVehicleLocationQueryHandler(
                    this.fleetRepository,
                    this.vehicleRepository,
                );
        }

        return this.getVehicleLocationQueryHandler;
    }

    public getIsVehicleRegisteredQueryHandler(): IsVehicleRegisteredQueryHandler {
        if (!this.isVehicleRegisteredQueryHandler) {
            this.isVehicleRegisteredQueryHandler =
                new IsVehicleRegisteredQueryHandler(
                    this.fleetRepository,
                    this.vehicleRepository,
                );
        }

        return this.isVehicleRegisteredQueryHandler;
    }
}
