import express, {Application} from 'express';
import myRouter from './routes/auth';
import morgan from 'morgan';
import path from 'path';

const app: Application = express();

// Settings
app.set('port', 4000);

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname,'./public')));

// Routes
app.use('/api/auth', myRouter);

export default app;
