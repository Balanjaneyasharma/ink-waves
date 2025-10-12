
import { config } from "./src/config";
import { connectDB } from "./src/config/database";

const startServer =  async () => { 
    try {
        await connectDB();
        
        const { app } = require('./src/app');
        const PORT = config.port;

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });   
    }
    catch (err) {
        console.error('Failed to start server', err);
    }
}

startServer();