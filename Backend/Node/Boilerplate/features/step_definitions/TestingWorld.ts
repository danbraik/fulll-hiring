import { World, IWorldOptions } from '@cucumber/cucumber';
import { FleetRepository } from '../../src/domain/repositories/FleetRepository';
import { InMemoryFleetRepository } from '../../src/infra/repositories/InMemoryFleetRepository';
import { Fleet } from '../../src/domain/entities/Fleet';

export class TestingWorld extends World {

    constructor(options: IWorldOptions<any>) {
        super(options);
    }
}
