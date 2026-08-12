import { Given, Then, When } from "@cucumber/cucumber";
import assert from "assert";
import { AlreadyRegisteredVehicleError } from "../../src/domain/entities/Fleet";
import { VehicleAlreadyParkedAtLocationError } from "../../src/domain/entities/Vehicle";
import { Location } from "../../src/domain/valueObjects/Location";
import type { TestingWorld } from "./TestingWorld";

Given("my fleet", async function () {
    const that = this as TestingWorld;

    const handlerResult = await that.getCreateFleetCommandHandler().handle({
        userId: "user-1",
    });
    assert(
        handlerResult.isSuccess,
        `Failed to create fleet: ${handlerResult.error?.message}`,
    );

    that.myFleet = handlerResult.getValue();
});

Given("a vehicle", async function () {
    const that = this as TestingWorld;

    const result = await that.getCreateVehicleCommandHandler().handle({
        plateNumber: "ABC-123",
    });
    assert(
        result.isSuccess,
        `Failed to create vehicle: ${result.error?.message}`,
    );

    that.myVehicle = result.getValue();
});

When("I register this vehicle into my fleet", async function () {
    const that = this as TestingWorld;

    assert(that.myFleet, "myFleet is not defined");
    assert(that.myVehicle, "myVehicle is not defined");

    const result = await that.getRegisterVehicleCommandHandler().handle({
        fleetId: that.myFleet.getId().toString(),
        plateNumber: that.myVehicle.getPlateNumber().toString(),
    });

    assert(
        result.isSuccess,
        `Failed to register vehicle: ${result.error?.message}`,
    );
});

Then("this vehicle should be part of my vehicle fleet", async function () {
    const that = this as TestingWorld;

    assert(that.myFleet, "myFleet is not defined");
    assert(that.myVehicle, "myVehicle is not defined");

    const result = await that.getIsVehicleRegisteredQueryHandler().handle({
        fleetId: that.myFleet.getId().toString(),
        plateNumber: that.myVehicle.getPlateNumber().toString(),
    });

    assert(
        result.isSuccess,
        `Failed to check vehicle registration: ${result.error?.message}`,
    );
    assert.strictEqual(result.getValue(), true);
});

Given("I have registered this vehicle into my fleet", async function () {
    const that = this as TestingWorld;

    assert(that.myFleet, "myFleet is not defined");
    assert(that.myVehicle, "myVehicle is not defined");

    const result = await that.getRegisterVehicleCommandHandler().handle({
        fleetId: that.myFleet.getId().toString(),
        plateNumber: that.myVehicle.getPlateNumber().toString(),
    });

    assert(
        result.isSuccess,
        `Failed to register vehicle: ${result.error?.message}`,
    );
});

When("I try to register this vehicle into my fleet", async function () {
    const that = this as TestingWorld;

    assert(that.myFleet, "myFleet is not defined");
    assert(that.myVehicle, "myVehicle is not defined");

    const result = await that.getRegisterVehicleCommandHandler().handle({
        fleetId: that.myFleet.getId().toString(),
        plateNumber: that.myVehicle.getPlateNumber().toString(),
    });

    that.lastRegisterVehicleResult = result;
});

Then(
    "I should be informed this this vehicle has already been registered into my fleet",
    function () {
        const that = this as TestingWorld;

        assert(
            that.lastRegisterVehicleResult,
            "lastRegisterVehicleResult is not defined",
        );
        assert(
            that.lastRegisterVehicleResult.error instanceof
                AlreadyRegisteredVehicleError,
            "Expected AlreadyRegisteredVehicleError",
        );
    },
);

Given("the fleet of another user", async function () {
    const that = this as TestingWorld;

    const handlerResult = await that.getCreateFleetCommandHandler().handle({
        userId: "user-1",
    });
    assert(
        handlerResult.isSuccess,
        `Failed to create fleet: ${handlerResult.error?.message}`,
    );

    that.otherFleet = handlerResult.getValue();
});

Given(
    "this vehicle has been registered into the other user's fleet",
    async function () {
        const that = this as TestingWorld;

        assert(that.otherFleet, "otherFleet is not defined");
        assert(that.myVehicle, "myVehicle is not defined");

        const result = await that.getRegisterVehicleCommandHandler().handle({
            fleetId: that.otherFleet.getId().toString(),
            plateNumber: that.myVehicle.getPlateNumber().toString(),
        });

        assert(
            result.isSuccess,
            `Failed to register vehicle: ${result.error?.message}`,
        );
    },
);

Given("a location", function () {
    const that = this as TestingWorld;
    that.aLocation = Location.create(12, 13);
});

When("I park my vehicle at this location", async function () {
    const that = this as TestingWorld;

    assert(that.myFleet, "myFleet is not defined");
    assert(that.myVehicle, "myVehicle is not defined");
    assert(that.aLocation, "aLocation is not defined");

    const result = await that.getParkMyVehicleCommandHandler().handle({
        fleetId: that.myFleet.getId().toString(),
        plateNumber: that.myVehicle.getPlateNumber().toString(),
        location: {
            latitude: that.aLocation.getLatitude(),
            longitude: that.aLocation.getLongitude(),
            altitude: that.aLocation.getAltitude(),
        },
    });

    assert(
        result.isSuccess,
        `Failed to park vehicle: ${result.error?.message}`,
    );
});

Then(
    "the known location of my vehicle should verify this location",
    async function () {
        const that = this as TestingWorld;

        assert(that.myFleet, "myFleet is not defined");
        assert(that.myVehicle, "myVehicle is not defined");
        assert(that.aLocation, "aLocation is not defined");

        const result = await that.getGetVehicleLocationQueryHandler().handle({
            fleetId: that.myFleet.getId().toString(),
            plateNumber: that.myVehicle.getPlateNumber().toString(),
        });

        assert(
            result.isSuccess,
            `Failed to get vehicle location: ${result.error?.message}`,
        );

        const knownLocation = result.getValue();
        assert(knownLocation, "Expected vehicle location to be defined");
        assert.strictEqual(knownLocation.equals(that.aLocation), true);
    },
);

Given("my vehicle has been parked into this location", async function () {
    const that = this as TestingWorld;

    assert(that.myFleet, "myFleet is not defined");
    assert(that.myVehicle, "myVehicle is not defined");
    assert(that.aLocation, "aLocation is not defined");

    const result = await that.getParkMyVehicleCommandHandler().handle({
        fleetId: that.myFleet.getId().toString(),
        plateNumber: that.myVehicle.getPlateNumber().toString(),
        location: {
            latitude: that.aLocation.getLatitude(),
            longitude: that.aLocation.getLongitude(),
            altitude: that.aLocation.getAltitude(),
        },
    });

    assert(
        result.isSuccess,
        `Failed to park vehicle: ${result.error?.message}`,
    );
});

When("I try to park my vehicle at this location", async function () {
    const that = this as TestingWorld;

    assert(that.myFleet, "myFleet is not defined");
    assert(that.myVehicle, "myVehicle is not defined");
    assert(that.aLocation, "aLocation is not defined");

    const result = await that.getParkMyVehicleCommandHandler().handle({
        fleetId: that.myFleet.getId().toString(),
        plateNumber: that.myVehicle.getPlateNumber().toString(),
        location: {
            latitude: that.aLocation.getLatitude(),
            longitude: that.aLocation.getLongitude(),
            altitude: that.aLocation.getAltitude(),
        },
    });

    that.lastParkMyVehicleResult = result;
});

Then(
    "I should be informed that my vehicle is already parked at this location",
    function () {
        const that = this as TestingWorld;

        assert(
            that.lastParkMyVehicleResult,
            "lastParkMyVehicleResult is not defined",
        );
        assert(
            that.lastParkMyVehicleResult.error instanceof
                VehicleAlreadyParkedAtLocationError,
            "Expected VehicleAlreadyParkedAtLocationError",
        );
    },
);
