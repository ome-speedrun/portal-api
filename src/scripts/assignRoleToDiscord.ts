import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { isRoleType } from '@domain/authorization/models/roles';
import {
  assignDiscordRole
} from '@domain/authorization/usecases/assignDiscordRole';

const argv = yargs(hideBin(process.argv)).options({
  t: { type: 'string', demandOption: true},
  d: { type: 'string', demandOption: true},
}).parseSync();

const type = argv.t;
const discordRoleId = argv.d;

if (!isRoleType(type)) {
  throw new Error('Invalid role type received.');
}

assignDiscordRole(discordRoleId, type)
  .then((role) => {
    if (role.isOk()) console.info(`Role created: ${JSON.stringify(role)}`);
    else console.error('Unexpected failed to create role.');

    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });


