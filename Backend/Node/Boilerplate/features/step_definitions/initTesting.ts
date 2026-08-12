import { After, Before, setWorldConstructor } from "@cucumber/cucumber";
import { initializeDatabase } from "../../src/infra/database/initialize";
import { SqlFleetRepository } from "../../src/infra/repositories/SqlFleetRepository";
import { SqlVehicleRepository } from "../../src/infra/repositories/SqlVehicleRepository";
import { TestingWorld } from "./TestingWorld";

setWorldConstructor(TestingWorld);

Before({ tags: "@critical" }, function () {
    const that = this as TestingWorld;
    that.database = initializeDatabase(":memory:");
    that.setRepositories(
        new SqlFleetRepository(that.database),
        new SqlVehicleRepository(that.database),
    );
});

After({ tags: "@critical" }, function () {
    const that = this as TestingWorld;
    if (that.database) {
        that.database.close();
    }
});
