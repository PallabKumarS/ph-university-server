import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

async function main() {
  try {
    // connect to database
    console.log('Connecting to database...');
    await mongoose.connect(config.database_url as string, {
      dbName: 'universityDB',
    });
    console.log('Connected to database');

    app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}
main();
