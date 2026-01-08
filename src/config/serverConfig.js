import express from 'express'
import cors from 'cors';

const ConfigServer = (app) => {
    app.use(cors())
    app.use(express.json())
    app.use(cors());
}

export default ConfigServer;