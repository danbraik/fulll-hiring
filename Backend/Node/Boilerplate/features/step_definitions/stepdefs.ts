import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';
import { TestingWorld } from './TestingWorld';
import { Vehicule } from '../../src/domain/entities/Vehicule';
import { VehiculeId } from '../../src/domain/valueObjects/VehiculeId';
import { PlateNumber } from '../../src/domain/valueObjects/PlateNumber';
import { Location } from '../../src/domain/valueObjects/Location';


Given('my fleet', async function () {
  const that = this as TestingWorld;

  const handlerResult = await that.createFleetCommandHandler.handle({ userId: 'user-1' });
  if (handlerResult.isFailure) {
    throw new Error('Failed to create fleet');
  }

  that.myFleet = handlerResult.getValue();
});

Given('a vehicle', async function () {
  const that = this as TestingWorld;

  that.myVehicule = Vehicule.create(
    VehiculeId.create('vehicule-1'),
    PlateNumber.create('ABC-123'),
    null
  );

  await that.vehiculeRepository.save(that.myVehicule);
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

