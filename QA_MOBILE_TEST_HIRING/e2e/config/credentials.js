/**
 * Test data. In the Fulll standard this comes from an account pool / env;
 * here the demo app validates against fixed credentials, so we centralise them.
 */
import credentials from '../data/credentials.json'

export const validUser = credentials.validUser
export const invalidUser = credentials.invalidUser
export const wrongPasswordUser = credentials.wrongPasswordUser

export default credentials
