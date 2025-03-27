import pm2 from 'pm2';
import { resolve } from 'path';

const appName = 'promo';
const scriptPath = resolve('./assets/connect.js'); // Resolve the absolute path of the script

const connectToPm2 = () => new Promise((resolve, reject) => {
    pm2.connect((err) => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

const disconnectFromPm2 = () => new Promise((resolve) => {
    pm2.disconnect(() => {
        resolve();
    });
});

export const startApp = async () => {
    try {
        await connectToPm2();
        pm2.start({
            name: appName,
            script: scriptPath,
            instances: 1
        }, async (err, apps) => {
            if (err) {
                console.error('Error starting app:', err);
            } else {
                console.log('App started successfully:', apps);
            }
            await disconnectFromPm2();
        });
    } catch (err) {
        console.error('Error connecting to PM2:', err);
    }
};

export const restartApp = async () => {
    try {
        await connectToPm2();
        pm2.restart(appName, async (err, apps) => {
            if (err) {
                console.error('Error restarting app:', err);
            } else {
                console.log('App restarted successfully:', apps);
            }
            await disconnectFromPm2();
        });
    } catch (err) {
        console.error('Error connecting to PM2:', err);
    }
};

export const stopApp = async () => {
    try {
        await connectToPm2();
        pm2.stop(appName, async (err, apps) => {
            if (err) {
                console.error('Error stopping app:', err);
            } else {
                console.log('App stopped successfully:', apps);
            }
            await disconnectFromPm2();
        });
    } catch (err) {
        console.error('Error connecting to PM2:', err);
    }
};

export const deleteApp = async () => {
    try {
        await connectToPm2();
        pm2.delete(appName, async (err, apps) => {
            if (err) {
                console.error('Error deleting app:', err);
            } else {
                if (!apps || apps.length === 0) {
                    console.error(`Error: App with name '${appName}' not found.`);
                    // Optionally, you might want to handle this case differently,
                    // for example, by resolving a Promise with an error.
                } else {
                    console.log('App deleted successfully:', apps);
                }
            }
            await disconnectFromPm2();
        });
    } catch (err) {
        console.error('Error connecting to PM2:', err);
    }
};