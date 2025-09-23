// backend.js
import express from 'express';
import admin from 'firebase-admin';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getIssueTips } from './gemini.js';
import multer from 'multer';
import { speechToText } from './speechToText.js';
import { detectWard } from './wardDetector.js';
import { HfInference } from '@huggingface/inference';

// Initialize dotenv
dotenv.config();

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------ CONFIG ------------
const WEB_API_KEY = process.env.WEB_API_KEY || "<YOUR_FIREBASE_WEB_API_KEY>";
const EMAIL_USER = process.env.EMAIL_USER || "your-email@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "your-app-password";
const wardMapping = JSON.parse(fs.readFileSync(path.join(__dirname, "./data/wardMapping.json")));
const deptMapping = JSON.parse(fs.readFileSync(path.join(__dirname, "./data/departmentMapping.json")));
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const hf = new HfInference(process.env.HF_API_KEY); // Free API key from huggingface.co/settings/tokens

// ------------ Firebase Init ------------
const serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, "./serviceAccountKey.json")));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET || undefined
});
const db = admin.firestore();
const auth = admin.auth();

// ------------ App Init ------------
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Rest of your code...
// No changes needed to the routes and other logic

// ------------ START ------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));