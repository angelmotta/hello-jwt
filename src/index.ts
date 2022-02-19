import dotenv from 'dotenv';
import app from './app';
import './database';

dotenv.config();

function main() {
  app.listen(app.get('port'));
  console.log(`Server listening on port ${app.get('port')}`);
}

main();