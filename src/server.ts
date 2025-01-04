import app from '@/app';
import logger from '@/logger';
import dbService from '@/services/db.service';
import process from 'node:process';

const port: string | number = process.env.PORT || 8000;

const initializeServices = async () => {
  try {
    await dbService.connect();
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

// Initialize services
void initializeServices();

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
