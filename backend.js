// backend.js
const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getIssueTips } = require("./gemini.js");
const multer = require("multer");
const { speechToText } = require("./speechToText");
const { detectWard } = require('./wardDetector'); // your new file




// ------------ CONFIG ------------
const WEB_API_KEY = process.env.WEB_API_KEY || "<YOUR_FIREBASE_WEB_API_KEY>";
const EMAIL_USER = process.env.EMAIL_USER || "your-email@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "your-app-password";
const wardMapping = JSON.parse(fs.readFileSync("./data/wardMapping.json"));
const deptMapping = JSON.parse(fs.readFileSync("./data/departmentMapping.json"));
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const { HfInference } = require("@huggingface/inference");
const hf = new HfInference(process.env.HF_API_KEY); // Free API key from huggingface.co/settings/tokens


// ------------ Firebase Init ------------
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json"));
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

// ------------ Email ------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS }
});
async function sendEmail(to, subject, text) {
  return transporter.sendMail({ from: `Civic Issue <${EMAIL_USER}>`, to, subject, text });
}




// ------------ File Upload ------------
const upload = multer({ dest: "uploads/" });

// ------------ Helpers ------------
async function reverseGeocodeOSM(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
    const resp = await axios.get(url, { headers: { "User-Agent": "CivicIssueApp/1.0" } });
    return resp.data.display_name || "";
  } catch {
    return "";
  }
}

async function geocodeAddress(address) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const resp = await axios.get(url, { headers: { "User-Agent": "CivicIssueApp/1.0" } });
    if (resp.data.length > 0) return { lat: resp.data[0].lat, lon: resp.data[0].lon };
    return null;
  } catch {
    return null;
  }
}


// Notification bhejne ka function
async function sendNotification(token, title, body) {
  try {
    const message = {
      notification: { title, body },
      token
    };
    await admin.messaging().send(message);
    console.log("Notification sent:", title);
  } catch (err) {
    console.error("Notification failed:", err.message);
  }
}

async function analyzeSentiment(text) {
  try {
    const result = await hf.textClassification({
      model: "distilbert-base-uncased-finetuned-sst-2-english",
      inputs: text,
    });
    return result[0]; // {label: "POSITIVE"/"NEGATIVE", score: 0.98}
  } catch (err) {
    console.error("HF sentiment error:", err.message);
    return { label: "NEUTRAL", score: 0.5 };
  }
}




async function generateTipsWithGemini(issue, location) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a civic assistant.\nIssue: ${issue}\nLocation: ${location}\nGive 2-3 short realistic tips.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch {
    return "Tips not available.";
  }
}

// Auth middleware
async function verifyIdTokenMiddleware(req, res, next) {
  const h = req.headers.authorization || "";
  if (!h.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });
  try {
    const decoded = await admin.auth().verifyIdToken(h.split(" ")[1]);
    req.authUser = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Admin check middleware
async function requireAdmin(req, res, next) {
  try {
    const snap = await db.collection("users").doc(req.authUser.uid).get();
    if (!snap.exists) return res.status(404).json({ error: "Admin user not found" });
    const user = snap.data();
    if (user.role !== "admin") return res.status(403).json({ error: "Admin only" });
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// ------------ AUTH ROUTES ------------
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, lat, lng, role } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ error: "Missing fields" });
    let address = "";
    if (lat && lng) address = await reverseGeocodeOSM(lat, lng);
    const userRecord = await auth.createUser({ email, password, displayName: name });
    let approved = role === "citizen";
    let otp = null, otpExpires = null;
    if (!approved) {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpExpires = Date.now() + 10 * 60 * 1000;
      await sendEmail(email, "OTP", `Your OTP is ${otp}`);
    }
    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid, name, email, phone: phone || null,
      address, lat: lat || null, lng: lng || null,
      role: approved ? role : `pending_${role}`, approved, otp, otpExpires,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ message: approved ? "Registered" : "OTP sent", uid: userRecord.uid });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { uid, otp } = req.body;
  const ref = db.collection("users").doc(uid);
  const snap = await ref.get();
  if (!snap.exists) return res.status(404).json({ error: "Not found" });
  const data = snap.data();
  if (data.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
  await ref.update({ approved: true, role: data.role.replace("pending_", ""), otp: null, otpExpires: null });
  res.json({ message: "Verified" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${WEB_API_KEY}`;
  try {
    const resp = await axios.post(url, { email, password, returnSecureToken: true });
    res.json({ idToken: resp.data.idToken, uid: resp.data.localId });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const link = await admin.auth().generatePasswordResetLink(email, { url: "http://localhost:3000/login" });
  await sendEmail(email, "Reset", link);
  res.json({ message: "Sent" });
});

app.get("/me", verifyIdTokenMiddleware, async (req, res) => {
  const doc = await db.collection("users").doc(req.authUser.uid).get();
  res.json({ profile: doc.data() });
});

// Approve staff role (Admin Only)
app.post("/admin/approve-role", verifyIdTokenMiddleware, async (req, res) => {
  try {
    const { uid, role } = req.body;
    if (!uid || !role) {
      return res.status(400).json({ error: "uid and role are required" });
    }

    // 🔒 Check if the logged-in user is admin
    const currentUserSnap = await db.collection("users").doc(req.authUser.uid).get();
    if (!currentUserSnap.exists) {
      return res.status(404).json({ error: "Current user not found" });
    }

    const currentUser = currentUserSnap.data();
    if (currentUser.role !== "admin") {
      return res.status(403).json({ error: `Only admins can approve staff. Your role: ${currentUser.role}` });
    }

    // ✅ Update target user role
    await db.collection("users").doc(uid).update({
      role, // e.g. "PWD Staff"
      approved: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ message: `Role '${role}' approved successfully`, uid });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all staff (optional filter by role)
app.get("/staff", verifyIdTokenMiddleware, async (req, res) => {
  try {
    const { role } = req.query;
    let query = db.collection("users").where("approved", "==", true);

    // Sirf staff hi dikhane ke liye (citizen exclude)
    query = query.where("role", "!=", "citizen");

    if (role) {
      query = query.where("role", "==", role); // e.g. role = "PWD Staff"
    }

    const snap = await query.get();
    const staffList = snap.docs.map(d => d.data());

    res.json({ staff: staffList });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


// ------------ ISSUE ROUTES ------------

app.post("/report-issue", verifyIdTokenMiddleware, upload.array("media", 3), async (req, res) => {
  try {
    let { category, description, address, lat, lon, city } = req.body;

    if (!category || !description || !city) {
      return res.status(400).json({ error: "Category, description, and city are required" });
    }

    // ---------------- Address / LatLon Fix ----------------
    let finalAddress = address;
    let finalLat = lat ? parseFloat(lat) : null;
    let finalLon = lon ? parseFloat(lon) : null;

    if ((!finalLat || !finalLon) && finalAddress) {
      const loc = await geocodeAddress(finalAddress);
      if (loc) {
        finalLat = parseFloat(loc.lat);
        finalLon = parseFloat(loc.lon);
      }
    } else if (finalLat && finalLon && !finalAddress) {
      finalAddress = await reverseGeocodeOSM(finalLat, finalLon);
    }

    // ---------------- Ward Lookup ----------------
    console.log("City from request:", city);
console.log("Available cities in wardMapping:", Object.keys(wardMapping));
const cityKey = Object.keys(wardMapping).find(
  c => c.toLowerCase().trim() === city.toString().toLowerCase().trim()
);
console.log("Matched cityKey:", cityKey);

    if (!cityKey) {
      console.log("Available cities in wardMapping:", Object.keys(wardMapping));
      return res.status(400).json({ error: "City not found in ward data" });
    }

    const ward = await detectWard({
      lat: finalLat,
      lon: finalLon,
      finalAddress,
      city,
      wardMapping
    });

    console.log("Resolved Ward:", ward.wardNo);
    console.log("Ward Members:", ward.members);

    // ---------------- Department Lookup ----------------
    const mappingKey = Object.keys(deptMapping).find(k =>
      category.toLowerCase().includes(k.toLowerCase())
    );
    const dept = mappingKey ? deptMapping[mappingKey].department : "Unknown Dept";
    console.log("Resolved Department:", dept);

    // ---------------- Tips ----------------
    const tips = await generateTipsWithGemini(category, finalAddress || city);

    // ---------------- Media ----------------
    const media = req.files.map(f => f.filename);

    // ---------------- Save Issue ----------------
    const token = uuidv4();
    await db.collection("issues").doc(token).set({
      token,
      uid: req.authUser.uid,
      category,
      categoryLower: category.toLowerCase(),
      description,
      address: finalAddress,
      lat: finalLat,
      lon: finalLon,
      city,
      cityLower: city.toLowerCase(),
      wardNo: ward.wardNo,
      members: ward.members,
      department: dept,
      departmentLower: dept.toLowerCase(),
      tips,
      media,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "open"
    });

    res.json({ message: "Issue submitted", token, wardNo: ward.wardNo, members: ward.members, department: dept, tips });

  } catch (e) {
    console.error("Error in /report-issue:", e);
    res.status(500).json({ error: e.message });
  }
});


app.get("/my-issues", verifyIdTokenMiddleware, async (req, res) => {
  const snap = await db.collection("issues").where("uid", "==", req.authUser.uid).get();
  res.json({ issues: snap.docs.map(d => d.data()) });
});

// 3️⃣ Edit own issue (only if status is pending/open)
app.put("/issues/:ticketNo", verifyIdTokenMiddleware, async (req, res) => {
  const { ticketNo } = req.params;
  const { description, category } = req.body;

  const issueRef = db.collection("issues").doc(ticketNo);
  const issueSnap = await issueRef.get();

  if (!issueSnap.exists) return res.status(404).json({ error: "Issue not found" });

  const issue = issueSnap.data();
  if (issue.uid !== req.authUser.uid) return res.status(403).json({ error: "Not your issue" });
  if (issue.status !== "open" && issue.status !== "pending") return res.status(400).json({ error: "Cannot edit after assignment" });

  await issueRef.update({ description, category, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  res.json({ message: "Issue updated" });
});

// ================== GENERAL ISSUE ROUTES ==================

// 4️⃣ List all issues (with optional filters: city, department, category)
app.get("/issues", verifyIdTokenMiddleware, async (req, res) => {
  try {
    const { city, department, category } = req.query;
    let query = db.collection("issues");

    if (city) query = query.where("cityLower", "==", city.toLowerCase());
    if (department) query = query.where("departmentLower", "==", department.toLowerCase());
    if (category) query = query.where("categoryLower", "==", category.toLowerCase());

    const snapshot = await query.get();
    const issues = snapshot.docs.map(doc => doc.data());
    res.json({ issues });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== STAFF / ADMIN ROUTES ==================

// 5️⃣ Update issue status (Assigned → In Progress → Resolved)
app.put("/issues/:ticketNo/status", verifyIdTokenMiddleware, async (req, res) => {
  try {
    const { ticketNo } = req.params;
    const { status } = req.body; // "Assigned" / "In Progress" / "Resolved"

    const validStatuses = ["Pending", "Assigned", "In Progress", "Resolved"];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });

    const issueRef = db.collection("issues").doc(ticketNo);
    const issueSnap = await issueRef.get();
    if (!issueSnap.exists) return res.status(404).json({ error: "Issue not found" });

    await issueRef.update({ status, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6️⃣ Upload proof photo (afterPhoto) and mark resolved
app.post("/issues/:ticketNo/upload-proof", verifyIdTokenMiddleware, upload.single("afterPhoto"), async (req, res) => {
  try {
    const { ticketNo } = req.params;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const issueRef = db.collection("issues").doc(ticketNo);
    const issueSnap = await issueRef.get();
    if (!issueSnap.exists) return res.status(404).json({ error: "Issue not found" });

    // Save file name / path
    await issueRef.update({
      afterPhoto: file.filename,
      status: "Resolved",
      resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: "Proof uploaded & issue marked resolved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Citizen raises a new demand
app.post("/raise-demand", verifyIdTokenMiddleware, upload.array("media", 3), async (req, res) => {
  try {
    let { description, address, lat, lon, city } = req.body;

    // Location fix
    let finalAddress = address;
    let finalLat = lat ? parseFloat(lat) : null;
    let finalLon = lon ? parseFloat(lon) : null;

    if ((!finalLat || !finalLon) && finalAddress) {
      const loc = await geocodeAddress(finalAddress);
      if (loc) { finalLat = parseFloat(loc.lat); finalLon = parseFloat(loc.lon); }
    } else if (finalLat && finalLon && !finalAddress) {
      finalAddress = await reverseGeocodeOSM(finalLat, finalLon);
    }

    // Media
    const media = req.files.map(f => f.filename);

    // Save Demand
    const token = uuidv4();
    await db.collection("demands").doc(token).set({
      token,
      uid: req.authUser.uid,
      description,
      address: finalAddress,
      lat: finalLat,
      lon: finalLon,
      city,
      cityLower: city.toLowerCase(),
      media,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "under review",
      votes: { yes: 0, no: 0 }
    });

    // Notify all citizens of that city (poll notification)
    const userSnap = await db.collection("users").where("cityLower", "==", city.toLowerCase()).get();
    for (const u of userSnap.docs) {
      const userToken = u.data().fcmToken;
      if (userToken) {
        await sendNotification(
          userToken,
          "New Demand Raised 📢",
          `Demand in ${city}: ${description}`
        );
      }
    }

    res.json({ message: "Demand raised successfully", token, status: "under review" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/my-demands", verifyIdTokenMiddleware, async (req, res) => {
  const snap = await db.collection("demands").where("uid", "==", req.authUser.uid).get();
  res.json({ demands: snap.docs.map(d => d.data()) });
});


app.get("/demands", verifyIdTokenMiddleware, async (req, res) => {
  try {
    const { city } = req.query;
    let query = db.collection("demands");
    if (city) query = query.where("cityLower", "==", city.toLowerCase());

    const snapshot = await query.get();
    res.json({ demands: snapshot.docs.map(doc => doc.data()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/demands/:token/vote", verifyIdTokenMiddleware, async (req, res) => {
  try {
    const { token } = req.params;
    const { vote } = req.body; // "yes" or "no"

    if (!["yes", "no"].includes(vote)) return res.status(400).json({ error: "Invalid vote" });

    const demandRef = db.collection("demands").doc(token);
    const demandSnap = await demandRef.get();
    if (!demandSnap.exists) return res.status(404).json({ error: "Demand not found" });

    const demand = demandSnap.data();

    // Check if already voted
    const voteId = `${req.authUser.uid}_${vote}`;
    const existingVotes = demand.voters || [];
    if (existingVotes.includes(req.authUser.uid)) {
      return res.status(400).json({ error: "Already voted" });
    }

    // Update vote count
    await demandRef.update({
      [`votes.${vote}`]: admin.firestore.FieldValue.increment(1),
      voters: admin.firestore.FieldValue.arrayUnion(req.authUser.uid)
    });

    // Auto approve if yes votes > 50%
    const updated = (await demandRef.get()).data();
    const totalVotes = updated.votes.yes + updated.votes.no;
    if (totalVotes > 0 && updated.votes.yes / totalVotes > 0.5 && updated.status === "under review") {
      await demandRef.update({ status: "approved" });

      // Notify admin
      const adminSnap = await db.collection("admins").get();
      for (const a of adminSnap.docs) {
        const adminToken = a.data().fcmToken;
        if (adminToken) {
          await sendNotification(
            adminToken,
            "Demand Approved ✅",
            `Demand in ${updated.city} approved by citizens`
          );
        }
      }
    }

    res.json({ message: "Vote registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/demands/:token/assign", verifyIdTokenMiddleware, async (req, res) => {
  try {
    const { token } = req.params;
    const { staffId } = req.body;

    const demandRef = db.collection("demands").doc(token);
    const demandSnap = await demandRef.get();
    if (!demandSnap.exists) return res.status(404).json({ error: "Demand not found" });

    await demandRef.update({
      assignedTo: staffId,
      status: "in progress",
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: "Demand assigned" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/demands/:token", verifyIdTokenMiddleware, async (req, res) => {
  try {
    const { token } = req.params;
    const snap = await db.collection("demands").doc(token).get();
    if (!snap.exists) return res.status(404).json({ error: "Demand not found" });
    res.json(snap.data());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/demands/:token/status", verifyIdTokenMiddleware, async (req, res) => {
  try {
    const { token } = req.params;
    const { status } = req.body; // "under review" | "approved" | "in progress" | "completed"

    const demandRef = db.collection("demands").doc(token);
    const snap = await demandRef.get();
    if (!snap.exists) return res.status(404).json({ error: "Demand not found" });

    await demandRef.update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: "Demand status updated", status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/demands/:token/upload-proof", verifyIdTokenMiddleware, upload.array("proof", 3), async (req, res) => {
  try {
    const { token } = req.params;
    const proofMedia = req.files.map(f => f.filename);

    const demandRef = db.collection("demands").doc(token);
    const snap = await demandRef.get();
    if (!snap.exists) return res.status(404).json({ error: "Demand not found" });

    await demandRef.update({
      proof: proofMedia,
      status: "completed",
      completedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: "Proof uploaded, demand marked as completed", proofMedia });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/feedback/:token", verifyIdTokenMiddleware, upload.array("media", 2), async (req, res) => {
  try {
    const { token } = req.params; // issue or demand token
    const { rating, text } = req.body;

    if (!rating) return res.status(400).json({ error: "Rating required" });

    let finalText = text || "";

    // If audio/video uploaded → convert to text
    if (req.files && req.files.length > 0) {
      for (const f of req.files) {
        if (f.mimetype.startsWith("audio") || f.mimetype.startsWith("video")) {
          const transcript = await speechToText(f.path);

if (transcript === "NO_AUDIO") {
  finalText += " (No audio in uploaded video)";
} else {
  finalText += " " + transcript;
}
        }
      }
    }

    // Sentiment analysis (Hugging Face)
    let sentiment = { label: "NEUTRAL", score: 0.5 };
    if (finalText.trim()) {
      sentiment = await analyzeSentiment(finalText);
    }

    // Save feedback
    const feedbackId = uuidv4();
    await db.collection("feedback").doc(feedbackId).set({
      feedbackId,
      token,
      uid: req.authUser.uid,
      rating: parseInt(rating),
      text: finalText,
      sentiment,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update department average rating
    const issueSnap = await db.collection("issues").doc(token).get();
    if (issueSnap.exists) {
      const issue = issueSnap.data();
      await db.collection("departments").doc(issue.department).set({
        totalRating: admin.firestore.FieldValue.increment(parseInt(rating)),
        count: admin.firestore.FieldValue.increment(1)
      }, { merge: true });
    }

    // Notify Admin
    const adminSnap = await db.collection("users").where("role", "==", "admin").get();
    for (const a of adminSnap.docs) {
      const adminToken = a.data().fcmToken;
      if (adminToken) {
        await sendNotification(adminToken, "New Feedback Received", `Rating: ${rating}, Sentiment: ${sentiment.label}`);
      }
    }

    res.json({ message: "Feedback submitted", sentiment });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ error: err.message });
  }
});


// GET /admin/map-data?city=CityName
app.get("/admin/map-data", verifyIdTokenMiddleware, requireAdmin, async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "City is required" });

    const [issuesSnap, demandsSnap] = await Promise.all([
      db.collection("issues").get(),
      db.collection("demands").get()
    ]);

    const cityLower = city.toLowerCase();

    const issues = issuesSnap.docs
      .map(d => d.data())
      .filter(i => i.city && i.city.toLowerCase() === cityLower) // filter by city ignoring case
      .map(data => ({
        token: data.token,
        lat: data.lat,
        lon: data.lon,
        address: data.address,
        category: data.category,
        status: data.status,
        wardNo: data.wardNo,
        assignedTo: data.assignedTo || [],
        createdAt: data.createdAt,
      }))
      .filter(i => i.lat && i.lon);

    const demands = demandsSnap.docs
      .map(d => d.data())
      .filter(d => d.city && d.city.toLowerCase() === cityLower)
      .map(data => ({
        token: data.token,
        lat: data.lat,
        lon: data.lon,
        address: data.address,
        description: data.description,
        status: data.status,
        createdAt: data.createdAt,
      }))
      .filter(d => d.lat && d.lon);

    res.json({ issues, demands });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /admin/assign-issue
// body: { ticketNo, staffIds: ["uid1","uid2"], note: "optional" }
app.post("/admin/assign-issue", verifyIdTokenMiddleware, requireAdmin, async (req, res) => {
  try {
    const { ticketNo, staffIds, note } = req.body;
    if (!ticketNo || !Array.isArray(staffIds) || staffIds.length === 0)
      return res.status(400).json({ error: "ticketNo and staffIds required" });

    const issueRef = db.collection("issues").doc(ticketNo);
    const issueSnap = await issueRef.get();
    if (!issueSnap.exists) return res.status(404).json({ error: "Issue not found" });

    // Update assignedTo array and status
    await issueRef.update({
      assignedTo: staffIds,
      status: "Assigned",
      assignmentNote: note || null,
      assignedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Send notification to each staff (if they have fcmToken in users collection)
    const promises = staffIds.map(async sid => {
      const s = await db.collection("users").doc(sid).get();
      if (!s.exists) return;
      const sdata = s.data();
      if (sdata.fcmToken) {
        await sendNotification(sdata.fcmToken, "New Task Assigned 🛠️", `Issue: ${ticketNo}. Category: ${issueSnap.data().category || ''}`);
      }
      // Optionally add assignment log per staff
      await db.collection("users").doc(sid).collection("assignments").doc(ticketNo).set({
        ticketNo, createdAt: admin.firestore.FieldValue.serverTimestamp(), fromAdmin: req.authUser.uid
      });
    });

    await Promise.all(promises);

    res.json({ message: "Assigned to staff", ticketNo, assignedTo: staffIds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /admin/issues/:ticketNo/assign-multiple
// body: { addStaffIds: ["uidX"], removeStaffIds: ["uidY"], note }
app.put("/admin/issues/:ticketNo/assign-multiple", verifyIdTokenMiddleware, requireAdmin, async (req, res) => {
  try {
    const { ticketNo } = req.params;
    const { addStaffIds = [], removeStaffIds = [], note } = req.body;
    const issueRef = db.collection("issues").doc(ticketNo);
    const snap = await issueRef.get();
    if (!snap.exists) return res.status(404).json({ error: "Issue not found" });

    const cur = snap.data().assignedTo || [];
    // compute new list
    const newList = Array.from(new Set([...cur.filter(id => !removeStaffIds.includes(id)), ...addStaffIds]));

    await issueRef.update({
      assignedTo: newList,
      assignmentNote: note || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Notify newly added staff
    const notifyPromises = addStaffIds.map(async sid => {
      const s = await db.collection("users").doc(sid).get();
      if (!s.exists) return;
      if (s.data().fcmToken) await sendNotification(s.data().fcmToken, "New Task Assigned 🛠️", `Issue: ${ticketNo}`);
    });
    await Promise.all(notifyPromises);

    res.json({ message: "Assignment updated", ticketNo, assignedTo: newList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /admin/demands/:token/approve
app.post("/admin/demands/:token/approve", verifyIdTokenMiddleware, requireAdmin, async (req, res) => {
  try {
    const { token } = req.params;
    const demandRef = db.collection("demands").doc(token);
    const snap = await demandRef.get();
    if (!snap.exists) return res.status(404).json({ error: "Demand not found" });
    const data = snap.data();

    await demandRef.update({ status: "approved", approvedAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    // Notify all citizens of that city
    const userSnap = await db.collection("users").where("cityLower", "==", data.cityLower).get();
    const notifyPromises = [];
    for (const u of userSnap.docs) {
      const ud = u.data();
      if (ud.fcmToken) notifyPromises.push(sendNotification(ud.fcmToken, "Demand Approved ✅", `Demand: ${data.description}`));
    }

    // Optionally notify admins/staff as well
    const staffSnap = await db.collection("users").where("role", "!=", "citizen").where("approved", "==", true).get();
    for (const s of staffSnap.docs) {
      const sd = s.data();
      if (sd.fcmToken) notifyPromises.push(sendNotification(sd.fcmToken, "Demand Approved (Action Required)", `Demand in ${data.city}: ${data.description}`));
    }

    await Promise.all(notifyPromises);
    res.json({ message: "Demand approved and notifications sent", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /admin/demands/:token/reject
app.post("/admin/demands/:token/reject", verifyIdTokenMiddleware, requireAdmin, async (req, res) => {
  try {
    const { token } = req.params;
    const { reason } = req.body;
    const demandRef = db.collection("demands").doc(token);
    const snap = await demandRef.get();
    if (!snap.exists) return res.status(404).json({ error: "Demand not found" });
    const data = snap.data();

    await demandRef.update({ status: "rejected", rejectedAt: admin.firestore.FieldValue.serverTimestamp(), rejectionReason: reason || null, updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    // Notify the demand creator
    const userSnap = await db.collection("users").doc(data.uid).get();
    if (userSnap.exists && userSnap.data().fcmToken) {
      await sendNotification(userSnap.data().fcmToken, "Your Demand was Rejected", reason || "Rejected by admin");
    }

    res.json({ message: "Demand rejected", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /admin/staff/workload
app.get("/admin/staff/workload", verifyIdTokenMiddleware, requireAdmin, async (req, res) => {
  try {
    const staffSnap = await db.collection("users").where("approved", "==", true).where("role", "!=", "citizen").get();
    const staffList = staffSnap.docs.map(d => ({ uid: d.id, ...d.data() }));

    // For each staff, query issues assigned and active
    const results = await Promise.all(staffList.map(async s => {
      const issuesSnap = await db.collection("issues").where("assignedTo", "array-contains", s.uid).get();
      const issues = issuesSnap.docs.map(d => d.data());
      // count open/in-progress/assigned
      const openCount = issues.filter(i => ["Assigned", "Pending", "In Progress"].includes(i.status)).length;
      return { uid: s.uid, name: s.name, role: s.role, openCount, issues: issues.map(i => ({ token: i.token, status: i.status, category: i.category })) };
    }));

    res.json({ workloads: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /admin/analytics?city=CityName&periodDays=30
app.get("/admin/analytics", verifyIdTokenMiddleware, requireAdmin, async (req, res) => {
  try {
    const { city, periodDays = 30 } = req.query;
    const since = new Date(Date.now() - parseInt(periodDays) * 24 * 3600 * 1000);

    let issuesQ = db.collection("issues").where("createdAt", ">=", admin.firestore.Timestamp.fromDate(since));
    if (city) issuesQ = issuesQ.where("cityLower", "==", city.toLowerCase());

    const issuesSnap = await issuesQ.get();
    const issues = issuesSnap.docs.map(d => d.data());

    // Hotspots by ward (count)
    const hotspots = {};
    for (const i of issues) {
      const ward = i.wardNo || "Unknown";
      hotspots[ward] = (hotspots[ward] || 0) + 1;
    }
    const hotspotsArr = Object.entries(hotspots).map(([ward, count]) => ({ ward, count })).sort((a,b)=>b.count-a.count);

    // Frequent issues by category
    const freq = {};
    for (const i of issues) {
      const c = i.category || "Unknown";
      freq[c] = (freq[c] || 0) + 1;
    }
    const frequentIssues = Object.entries(freq).map(([cat, count]) => ({ category: cat, count })).sort((a,b)=>b.count-a.count).slice(0,10);

    // Avg resolution time by department
    const deptTimes = {}; // dept -> { totalMs, count }
    for (const i of issues) {
      if (i.resolvedAt && i.createdAt && i.department) {
        const created = i.createdAt.toDate ? i.createdAt.toDate() : new Date(i.createdAt);
        const resolved = i.resolvedAt.toDate ? i.resolvedAt.toDate() : new Date(i.resolvedAt);
        const ms = resolved - created;
        const dept = i.department || "Unknown";
        if (!deptTimes[dept]) deptTimes[dept] = { totalMs: 0, count: 0 };
        deptTimes[dept].totalMs += ms;
        deptTimes[dept].count += 1;
      }
    }
    const avgResolution = Object.entries(deptTimes).map(([dept, v]) => ({ department: dept, avgHours: (v.totalMs / v.count) / (1000*3600) })).sort((a,b)=>a.avgHours-b.avgHours);

    // Citizen satisfaction percent from feedback (by department)
    // Need to join feedback -> issue -> department
    const feedbackSnap = await db.collection("feedback").where("createdAt", ">=", admin.firestore.Timestamp.fromDate(since)).get();
    const deptFeedback = {}; // dept -> { totalRating, count, positiveCount }
    for (const f of feedbackSnap.docs) {
      const fd = f.data();
      const rating = fd.rating || 0;
      const token = fd.token;
      // fetch issue to know department
      const issueSnap = await db.collection("issues").doc(token).get();
      const dept = issueSnap.exists ? (issueSnap.data().department || "Unknown") : "Unknown";
      if (!deptFeedback[dept]) deptFeedback[dept] = { totalRating: 0, count: 0, positive: 0 };
      deptFeedback[dept].totalRating += rating;
      deptFeedback[dept].count += 1;
      if (rating >= 4) deptFeedback[dept].positive += 1;
    }
    const satisfaction = Object.entries(deptFeedback).map(([dept, v]) => ({
      department: dept,
      avgRating: v.totalRating / v.count,
      positivePercent: Math.round((v.positive / v.count) * 100)
    })).sort((a,b)=>b.positivePercent - a.positivePercent);

    // Department leaderboard: combine avgResolution (lower better) and satisfaction (higher better)
    // For simplicity produce two leaderboards
    const leaderboardByResolution = avgResolution.slice(0,10);
    const leaderboardBySatisfaction = satisfaction.slice(0,10);

    res.json({
      hotspots: hotspotsArr,
      frequentIssues,
      avgResolutionHoursByDepartment: avgResolution,
      satisfactionByDepartment: satisfaction,
      leaderboardByResolution,
      leaderboardBySatisfaction,
      totalIssues: issues.length
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /staff/tasks
app.get("/staff/tasks", verifyIdTokenMiddleware, async (req, res) => {
  try {
    const uid = req.authUser.uid;

    const staffSnap = await db.collection("users").doc(uid).get();
    if (!staffSnap.exists) return res.status(404).json({ error: "Staff not found" });

    const assignments = staffSnap.data().assignments || [];
    if (assignments.length === 0) return res.json({ tasks: [] });

    const ticketIDs = assignments.map(a => typeof a === "string" ? a : a.ticketNo);

    const issuePromises = ticketIDs.map(ticketNo =>
      db.collection("issues").where("token", "==", ticketNo).get()
    );
    const issueSnapshots = await Promise.all(issuePromises);

    const tasks = issueSnapshots.flatMap(snap => snap.docs.map(d => {
      const data = d.data();
      return {
        token: data.token,
        category: data.category,
        description: data.description,
        address: data.address,
        lat: data.lat,
        lon: data.lon,
        status: data.status,
        afterPhoto: data.afterPhoto || null,
        assignedAt: data.updatedAt || data.createdAt,
        resolvedAt: data.resolvedAt || null
      };
    }));

    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST /staff/tasks/:ticketNo/upload-proof
app.post("/staff/tasks/:ticketNo/upload-proof", verifyIdTokenMiddleware, upload.single("afterPhoto"), async (req, res) => {
  try {
    const { ticketNo } = req.params;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const issueRef = db.collection("issues").doc(ticketNo);
    const issueSnap = await issueRef.get();
    if (!issueSnap.exists) return res.status(404).json({ error: "Issue not found" });

    // ✅ Update issue with proof and resolved status
    await issueRef.update({
      afterPhoto: file.filename,
      status: "Resolved",
      resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: "Proof uploaded & issue marked resolved", ticketNo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /staff/history
app.get("/staff/history", verifyIdTokenMiddleware, async (req, res) => {
  try {
    const uid = req.authUser.uid;

    const snap = await db.collection("issues")
      .where("uid", "==", uid)
      .where("status", "==", "Resolved")
      .orderBy("resolvedAt", "desc")
      .get();

    const history = snap.docs.map(d => {
      const data = d.data();
      return {
        token: data.token,
        category: data.category,
        description: data.description,
        resolvedAt: data.resolvedAt,
        afterPhoto: data.afterPhoto,
        lat: data.lat,
        lon: data.lon,
        address: data.address
      };
    });

    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ------------ START ------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));
