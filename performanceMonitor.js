const os = require('os');
const si = require('systeminformation');
const { logInfo } = require('./logger');

// Fonction pour surveiller les performances du système
async function monitorPerformance() {
    const cpuLoad = await si.currentLoad();
    const memoryInfo = await si.mem();
    const diskInfo = await si.fsSize();
    
    const performanceData = {
        cpu: {
            usage: cpuLoad.currentLoad,
            cores: os.cpus().length
        },
        memory: {
            total: memoryInfo.total,
            free: memoryInfo.free,
            used: memoryInfo.used,
            usagePercentage: ((memoryInfo.used / memoryInfo.total) * 100).toFixed(2)
        },
        disk: diskInfo.map(disk => ({
            filesystem: disk.fs,
            size: disk.size,
            used: disk.used,
            available: disk.available,
            usagePercentage: ((disk.used / disk.size) * 100).toFixed(2)
        }))
    };

    logInfo(`Performance Data: ${JSON.stringify(performanceData)}`);
    return performanceData;
}

module.exports = {
    monitorPerformance
};