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

Given('a vehicle', function () {
  const that = this as TestingWorld;

  that.myVehicule = Vehicule.create(
    VehiculeId.create('vehicule-1'),
    PlateNumber.create('ABC-123'),
    Location.create(0, 0)
  );
});

