const { Queue } = require('bull');
const queue = new Queue('taskQueue');

// Fonction pour ajouter une tâche à la file d'attente
async function addTask(taskData) {
    await queue.add(taskData);
}

// Fonction pour traiter les tâches dans la file d'attente
queue.process(async (job) => {
    // Logique pour traiter la tâche
    console.log(`Processing job ${job.id} with data:`, job.data);
    // Simulation d'un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 2000));
    return Promise.resolve();
});

// Fonction pour récupérer les tâches en attente
async function getPendingTasks() {
    const jobs = await queue.getWaiting();
    return jobs;
}

module.exports = {
    addTask,
    getPendingTasks
};