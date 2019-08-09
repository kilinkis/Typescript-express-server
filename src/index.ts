import express, { Request, Response } from 'express';
import { router } from './routes/loginRoutes';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({keys: ['dummy']}));
app.use(router);

app.get('/', (req: Request, res: Response) => {
  res.send(`
    <div>
      <h1>Hello</h1>
    </div>
  `);
});

app.listen(3000, () => {
  console.log('listentin 3000');
});