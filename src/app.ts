import express, {Application} from 'express';
import myRouter from './routes/auth';
import morgan from 'morgan';

const app: Application = express();

// Settings
app.set('port', 4000);

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', myRouter);

export default app;
