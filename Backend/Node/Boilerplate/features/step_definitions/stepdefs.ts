import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';
import { TestingWorld } from './TestingWorld';


Given('my fleet', async function () {
  const that = this as TestingWorld;

  const handlerResult = await that.createFleetCommandHandler.handle({ userId: 'user-1' });
  if (handlerResult.isFailure) {
    throw new Error('Failed to create fleet');
  }

  that.myFleet = handlerResult.getValue();
});
