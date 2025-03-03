import express, { Express, Request, Response } from 'express';
import next from 'next';
import dotenv from 'dotenv';

// Load environmental variables
dotenv.config();

const PORT: string | number = process.env.PORT || 3000;
const dev: boolean = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: './' });
// Tell Express how to handle incoming requests to server Next.js pages
const handle = app.getRequestHandler();

async function startServer(): Promise<void> {
    try {
        // Wait for Next.js to be ready;
        await app.prepare();

        const server: Express = express();

        // Catch all route to handle Next.js pages
        server.get('*', (req: Request, res: Response) => {
            return handle(req, res);
        });

        server.listen(PORT, (err?: Error) => {
            if (err) {
                console.error(`Error starting server: ${err}`);
            }

            console.info(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(`Error starting server: ${err.message}`);
        } else {
            console.error(`Error starting server: ${err}`);
        }
    }
}

startServer();
