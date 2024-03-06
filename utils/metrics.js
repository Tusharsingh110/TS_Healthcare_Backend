const express = require('express');
const client = require('prom-client');

const app = express();

const restResponseTimeHistogram = new client.Histogram({
    name:'rest_response_time_duration_seconds',
    help:'REST API RESPONSE TIME IN SECONDS',
    labelNames: ['method', 'route' , 'status_Code']
});

const databaseResponseTimeHistogram = new client.Histogram({
    name:'db_response_time_duration_seconds',
    help:'Database RESPONSE TIME IN SECONDS',
    labelNames: ['operation', 'success' ]
});

function startMetricsServer() {
    const collectDefaultMetrics = client.collectDefaultMetrics;
    collectDefaultMetrics();
    app.get('/metrics', async (req,res) => {
        res.set("Content-Type", client.register.contentType);
        res.send(await client.register.metrics());
    });

    app.listen(9100, () => {
        console.log('Metrics server started @ http://localhost:9100');
    });
}

module.exports = {
    startMetricsServer, 
    restResponseTimeHistogram, 
    databaseResponseTimeHistogram
};
