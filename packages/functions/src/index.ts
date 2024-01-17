import express from 'express';
import * as functions from 'firebase-functions';

const app = express();


app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok'
    })
})

exports.app = functions.https.onRequest(app);