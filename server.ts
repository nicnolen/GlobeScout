import express, { Express, Request, Response } from 'express';
import next from 'next';
import path from 'path';

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.resolve(__dirname, './') });
const handle = app.getRequestHandler();

// Prepare and start the server
app.prepare().then(() => {
    const server: Express = express();

    // Catch-all route to handle Next.js pages
    server.get('*', (req: Request, res: Response) => {
        return handle(req, res);
    });

    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log('Express Server running on http://localhost:3000');
    });
});
