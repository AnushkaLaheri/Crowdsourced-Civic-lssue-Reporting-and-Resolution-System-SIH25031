const fs = require('fs');
const wardBoxes = JSON.parse(fs.readFileSync("./data/deogharWards.json", "utf-8"));
console.log("Loaded wardBoxes keys:", Object.keys(wardBoxes));

// Bounding box match helper
function getWardFromLatLon(city, lat, lon) {
  // Add fallback if wardBoxes is flat
  const wards = wardBoxes[city] || wardBoxes; // agar city key nahi hai, pura JSON use karo
  if (!wards) return { wardNo: "Unknown", members: [] };

  for (const [wardNo, box] of Object.entries(wards)) {
    if (lat >= box.minLat && lat <= box.maxLat && lon >= box.minLon && lon <= box.maxLon) {
      return { wardNo, members: box.members || [] };
    }
  }

  return { wardNo: "Unknown", members: [] };
}


// Main detect function
async function detectWard({ lat, lon, city, finalAddress, wardMapping }) {
  let wardNo = "Unknown";
  let members = [];

  if (!city) return { wardNo, members };

  const cityKey = Object.keys(wardMapping).find(
    c => c.toLowerCase().trim() === city.toLowerCase().trim()
  );
  if (!cityKey) return { wardNo, members }; // city not in wardMapping

  // 1️⃣ Bounding box check
  if (lat && lon) {
    const ward = getWardFromLatLon(cityKey, lat, lon);
    if (ward?.wardNo && ward.wardNo !== "Unknown") {
      wardNo = ward.wardNo;
      members = ward.members || wardMapping[cityKey][wardNo]?.members || [];
    }
  }

  // 2️⃣ Address string fallback
  if (wardNo === "Unknown" && finalAddress) {
    for (const w of Object.keys(wardMapping[cityKey])) {
      const wardNameStr = wardMapping[cityKey][w]?.name || w;
      if (finalAddress.toLowerCase().includes(wardNameStr.toLowerCase())) {
        wardNo = w;
        members = wardMapping[cityKey][wardNo]?.members || [];
        break;
      }
    }
  }

  return { wardNo, members };
}

module.exports = { detectWard };
