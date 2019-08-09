import { Router, Request, Response } from 'express';
import { Recoverable } from 'repl';
import { NextFunction } from 'connect';

// extends Request and adds more appropirate types for the body property, which is typed as :any in the types definition file
interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined }
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.loggedIn) {
    next();
    return;
  }

  res.status(403);
  res.send('Not permitted');
}

const router = Router();

router.get('/login', (req: Request, res: Response) => {
  res.send(`
    <form method="POST">
      <div>
        <label>Email</label>
        <input name="email" />
      </div>
      <div>
        <label>Password</label>
        <input name="password" type="password" />
      </div>
      <button>Submit</button>
    </form>
  `);
});

router.post('/login', (req: RequestWithBody, res: Response) => {
  const {email, password} = req.body;

  if(email && password && email === 'juanofx@gmail.com' && password === 'password'){
    req.session = { loggedIn : true };
    res.redirect('/');
  } else {
    res.send('Invalid email or password');
  }

});

router.get('/', (req: Request, res: Response) => {
  if (req.session && req.session.loggedIn){
    res.send(`
      <div>
        <h1>you are logged in</h1>
        <a href="/logout">Log out</a>
      </div>
    `);
  } else {
    res.send(`
      <div>
        <h1>you are not logged in</h1>
        <a href="/login">Log in</a>
      </div>
    `);
  }
});

router.get('/logout', (req: Request, res: Response) => {
  req.session = { loggedIn : undefined };
  res.redirect('/');
});

router.get('/protected', requireAuth, (req: Request, res: Response) => {
  res.send('Welcome to a protected route, which only logged in users can see.')
});

export { router };