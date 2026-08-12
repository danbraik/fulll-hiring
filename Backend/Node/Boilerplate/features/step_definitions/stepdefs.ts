import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';
import { TestingWorld } from './TestingWorld';
import { Vehicule } from '../../src/domain/entities/Vehicule';
import { VehiculeId } from '../../src/domain/valueObjects/VehiculeId';
import { PlateNumber } from '../../src/domain/valueObjects/PlateNumber';
import { AlreadyRegisteredVehiculeError } from '../../src/domain/entities/Fleet';
import { Location } from '../../src/domain/valueObjects/Location';

Given('my fleet', async function () {
  const that = this as TestingWorld;

  const handlerResult = await that.createFleetCommandHandler.handle({ userId: 'user-1' });
  assert(handlerResult.isSuccess, `Failed to create fleet: ${handlerResult.error?.message}`);

  that.myFleet = handlerResult.getValue();
});

Given('a vehicle', async function () {
  const that = this as TestingWorld;

  that.myVehicule = Vehicule.create(
    VehiculeId.create('vehicule-1'),
    PlateNumber.create('ABC-123'),
    null
  );

  const result = await that.vehiculeRepository.save(that.myVehicule);
  assert(result.isSuccess, `Failed to save vehicle: ${result.error?.message}`);
});


When('I register this vehicle into my fleet', async function () {
  const that = this as TestingWorld;

  assert(that.myFleet, 'myFleet is not defined');
  assert(that.myVehicule, 'myVehicule is not defined');

  const result = await that.registerVehiculeCommandHandler.handle({
    fleetId: that.myFleet.getId().toString(),
    plateNumber: that.myVehicule.getPlateNumber().toString(),
  });

  assert(result.isSuccess, `Failed to register vehicle: ${result.error?.message}`);
});

Then('this vehicle should be part of my vehicle fleet', async function () {
  const that = this as TestingWorld;

  assert(that.myFleet, 'myFleet is not defined');
  assert(that.myVehicule, 'myVehicule is not defined');

  const result = await that.isVehicleRegisteredQueryHandler.handle({
    fleetId: that.myFleet.getId().toString(),
    plateNumber: that.myVehicule.getPlateNumber().toString(),
  });

  assert(result.isSuccess, `Failed to check vehicle registration: ${result.error?.message}`);
  assert.strictEqual(result.getValue(), true);
});

Given('I have registered this vehicle into my fleet', async function () {
  const that = this as TestingWorld;

  assert(that.myFleet, 'myFleet is not defined');
  assert(that.myVehicule, 'myVehicule is not defined');

  const result = await that.registerVehiculeCommandHandler.handle({
    fleetId: that.myFleet.getId().toString(),
    plateNumber: that.myVehicule.getPlateNumber().toString(),
  });

  assert(result.isSuccess, `Failed to register vehicle: ${result.error?.message}`);
});

When('I try to register this vehicle into my fleet', async function () {
  const that = this as TestingWorld;

  assert(that.myFleet, 'myFleet is not defined');
  assert(that.myVehicule, 'myVehicule is not defined');

  const result = await that.registerVehiculeCommandHandler.handle({
    fleetId: that.myFleet.getId().toString(),
    plateNumber: that.myVehicule.getPlateNumber().toString(),
  });

  that.lastRegisterVehiculeResult = result;
});

Then('I should be informed this this vehicle has already been registered into my fleet', function () {
  const that = this as TestingWorld;

  assert(that.lastRegisterVehiculeResult, 'lastRegisterVehiculeResult is not defined');
  assert(that.lastRegisterVehiculeResult.error instanceof AlreadyRegisteredVehiculeError, 'Expected AlreadyRegisteredVehiculeError');
});

Given('the fleet of another user', async function () {
  const that = this as TestingWorld;

  const handlerResult = await that.createFleetCommandHandler.handle({ userId: 'user-1' });
  assert(handlerResult.isSuccess, `Failed to create fleet: ${handlerResult.error?.message}`);

  that.otherFleet = handlerResult.getValue();
});

Given('this vehicle has been registered into the other user\'s fleet', async function () {
  const that = this as TestingWorld;

  assert(that.otherFleet, 'otherFleet is not defined');
  assert(that.myVehicule, 'myVehicule is not defined');

  const result = await that.registerVehiculeCommandHandler.handle({
    fleetId: that.otherFleet.getId().toString(),
    plateNumber: that.myVehicule.getPlateNumber().toString(),
  });

  assert(result.isSuccess, `Failed to register vehicle: ${result.error?.message}`);
});

Given('a location', function () {
  const that = this as TestingWorld;
  that.aLocation = Location.create(12, 13);
});

When('I park my vehicle at this location', async function () {
  const that = this as TestingWorld;

  assert(that.myFleet, 'myFleet is not defined');
  assert(that.myVehicule, 'myVehicule is not defined');
  assert(that.aLocation, 'aLocation is not defined');

  const result = await that.parkMyVehicleCommandHandler.handle({
    fleetId: that.myFleet.getId().toString(),
    plateNumber: that.myVehicule.getPlateNumber().toString(),
    location: {
      latitude: that.aLocation.getLatitude(),
      longitude: that.aLocation.getLongitude(),
      altitude: that.aLocation.getAltitude(),
    },
  });

  assert(result.isSuccess, `Failed to park vehicle: ${result.error?.message}`);
});

Then('the known location of my vehicle should verify this location', async function () {
  const that = this as TestingWorld;

  assert(that.myFleet, 'myFleet is not defined');
  assert(that.myVehicule, 'myVehicule is not defined');
  assert(that.aLocation, 'aLocation is not defined');

  const result = await that.getVehicleLocationQueryHandler.handle({
    fleetId: that.myFleet.getId().toString(),
    plateNumber: that.myVehicule.getPlateNumber().toString(),
  });

  assert(result.isSuccess, `Failed to get vehicle location: ${result.error?.message}`);

  const knownLocation = result.getValue();
  assert(knownLocation, 'Expected vehicle location to be defined');
  assert.strictEqual(knownLocation.equals(that.aLocation), true);
});
