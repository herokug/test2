// manageApp.js
import { startApp, restartApp, stopApp, deleteApp } from './pm2.js';

// Example usage
const action = process.argv[2]; // Get the action from command line arguments

switch (action) {
    case '--start':
        startApp();
        break;
    case '--sithuwili':
        startApp();
        break;
    case '--restart':
        restartApp();
        break;
    case '--stop':
        stopApp();
        break;
    case '--delete':
        deleteApp();
        break;
    default:
        console.log('Usage: node manageApp.js [start|restart|stop|delete]');
}
