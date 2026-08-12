import { World, IWorldOptions } from '@cucumber/cucumber';
import { FleetRepository } from '../../src/domain/repositories/FleetRepository';
import { InMemoryFleetRepository } from '../../src/infra/repositories/InMemoryFleetRepository';
import { Fleet } from '../../src/domain/entities/Fleet';
import { CreateFleetCommandHandler } from '../../src/app/useCases/commands/createFleet/CreateFleetCommandHandler';

export class TestingWorld extends World {
    fleetRepository: FleetRepository;
    createFleetCommandHandler: CreateFleetCommandHandler;
    myFleet?: Fleet;

    constructor(options: IWorldOptions<any>) {
        super(options);
        this.fleetRepository = new InMemoryFleetRepository();
        this.createFleetCommandHandler = new CreateFleetCommandHandler(this.fleetRepository);
    }
}
