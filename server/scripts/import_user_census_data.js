/**
 * Script to import and sync user provided Census 2011 PCA SC data for:
 * 1. Ratlam (434)
 * 2. Rewa (430)
 * 3. Morena (419)
 * 4. Shahdol (460)
 * 5. Jabalpur (457)
 * 
 * Synchronizes to BOTH:
 * - Local JSON files (master_census_records.json & census_sc_data.json)
 * - MongoDB Atlas cloud database (districtcensuses collection)
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const config = require('../config/keys');
const DistrictCensus = require('../models/DistrictCensus');

// Raw dataset definitions provided by user
const ratlamData = {
  "source": "pca_state_distt_sc.xls",
  "district_name": "Ratlam",
  "district_code": 434,
  "state_code": 23,
  "coordinates": { "lat": 23.3315, "lng": 75.0367 },
  "records": [
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 434,
      "Area Name": "Ratlam",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_CL",
      "NCO name": "Cultivators",
      "Total Persons": 14689,
      "Total Males": 9796,
      "Total Females": 4893,
      "Rural Persons": 14689,
      "Rural Males": 9796,
      "Rural Females": 4893,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["farming"],
      "Interest areas": ["agriculture"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    },
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 434,
      "Area Name": "Ratlam",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_AL",
      "NCO name": "Agricultural Labourers",
      "Total Persons": 30443,
      "Total Males": 17237,
      "Total Females": 13206,
      "Rural Persons": 30443,
      "Rural Males": 17237,
      "Rural Females": 13206,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["farming"],
      "Interest areas": ["agriculture"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    },
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 434,
      "Area Name": "Ratlam",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_HH",
      "NCO name": "Household Industry Workers",
      "Total Persons": 284,
      "Total Males": 181,
      "Total Females": 103,
      "Rural Persons": 284,
      "Rural Males": 181,
      "Rural Females": 103,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["other"],
      "Interest areas": ["business"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    },
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 434,
      "Area Name": "Ratlam",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_OT",
      "NCO name": "Other Workers",
      "Total Persons": 3587,
      "Total Males": 2799,
      "Total Females": 788,
      "Rural Persons": 3587,
      "Rural Males": 2799,
      "Rural Females": 788,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["other"],
      "Interest areas": ["business"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    }
  ]
};

const ratlamTechRoles = [
  "Computer Operator", "Data Entry Assistant", "Digital Service Assistant", "IT Support Assistant", "Mobile App Support Worker",
  "Computer Training Assistant", "Digital Literacy Facilitator", "Village IT Assistant", "Online Services Assistant", "Web Support Assistant"
];
for (let i = 1; i <= 30; i++) {
  const idStr = String(i).padStart(3, '0');
  const roleName = ratlamTechRoles[(i - 1) % ratlamTechRoles.length];
  const persons = [37, 15, 22, 29, 36, 14, 21, 28, 35, 13, 20, 27, 34, 12, 19, 26, 33, 11, 18, 25, 32, 10, 17, 24, 31, 9, 16, 23, 30, 37][i - 1];
  const males = Math.floor(persons / 2);
  const females = persons - males;
  ratlamData.records.push({
    "record_type": "dummy",
    "dummy_id": `TECH_${idStr}`,
    "Table name": "DEMO_DUMMY",
    "State code": 23,
    "District code": 434,
    "Area Name": `Sample Village ${i}`,
    "Division": "DUMMY",
    "Sub-Division": "DUMMY",
    "Group": "DUMMY",
    "Family": "DUMMY",
    "NCO name": roleName,
    "Total Persons": persons,
    "Total Males": males,
    "Total Females": females,
    "Rural Persons": persons,
    "Rural Males": males,
    "Rural Females": females,
    "Urban Persons": 0,
    "Urban Males": 0,
    "Urban Females": 0,
    "Job category": ["technology"],
    "Interest areas": ["technology"],
    "source": "synthetic_demo_data",
    "note": "Dummy record for demo/testing; not an official statistic."
  });
}

const ratlamHealthRoles = [
  "Health Outreach Assistant", "Community Health Support Worker", "Health Data Assistant", "Clinic Support Assistant",
  "Nutrition Program Assistant", "Medical Records Assistant", "Pharmacy Support Assistant", "Health Camp Assistant",
  "Telehealth Support Assistant", "Village Health Facilitator"
];
for (let i = 31; i <= 60; i++) {
  const idStr = String(i).padStart(3, '0');
  const roleName = ratlamHealthRoles[(i - 31) % ratlamHealthRoles.length];
  const persons = [37, 15, 22, 29, 36, 14, 21, 28, 35, 13, 20, 27, 34, 12, 19, 26, 33, 11, 18, 25, 32, 10, 17, 24, 31, 9, 16, 23, 30, 37][i - 31];
  const males = Math.floor(persons / 2);
  const females = persons - males;
  ratlamData.records.push({
    "record_type": "dummy",
    "dummy_id": `HEALTH_${idStr}`,
    "Table name": "DEMO_DUMMY",
    "State code": 23,
    "District code": 434,
    "Area Name": `Sample Village ${i}`,
    "Division": "DUMMY",
    "Sub-Division": "DUMMY",
    "Group": "DUMMY",
    "Family": "DUMMY",
    "NCO name": roleName,
    "Total Persons": persons,
    "Total Males": males,
    "Total Females": females,
    "Rural Persons": persons,
    "Rural Males": males,
    "Rural Females": females,
    "Urban Persons": 0,
    "Urban Males": 0,
    "Urban Females": 0,
    "Job category": ["healthcare"],
    "Interest areas": ["healthcare"],
    "source": "synthetic_demo_data",
    "note": "Dummy record for demo/testing; not an official statistic."
  });
}

const ratlamEduRoles = [
  "School Data Assistant", "Reading Program Assistant", "Education Outreach Assistant", "Training Center Assistant",
  "Village Education Facilitator", "Learning Support Assistant", "Digital Education Assistant", "School Office Assistant",
  "Community Tutor", "Education Program Assistant"
];
for (let i = 61; i <= 90; i++) {
  const idStr = String(i).padStart(3, '0');
  const roleName = ratlamEduRoles[(i - 61) % ratlamEduRoles.length];
  const persons = [37, 15, 22, 29, 36, 14, 21, 28, 35, 13, 20, 27, 34, 12, 19, 26, 33, 11, 18, 25, 32, 10, 17, 24, 31, 9, 16, 23, 30, 37][i - 61];
  const males = Math.floor(persons / 2);
  const females = persons - males;
  ratlamData.records.push({
    "record_type": "dummy",
    "dummy_id": `EDU_${idStr}`,
    "Table name": "DEMO_DUMMY",
    "State code": 23,
    "District code": 434,
    "Area Name": `Sample Village ${i}`,
    "Division": "DUMMY",
    "Sub-Division": "DUMMY",
    "Group": "DUMMY",
    "Family": "DUMMY",
    "NCO name": roleName,
    "Total Persons": persons,
    "Total Males": males,
    "Total Females": females,
    "Rural Persons": persons,
    "Rural Males": males,
    "Rural Females": females,
    "Urban Persons": 0,
    "Urban Males": 0,
    "Urban Females": 0,
    "Job category": ["education"],
    "Interest areas": ["education"],
    "source": "synthetic_demo_data",
    "note": "Dummy record for demo/testing; not an official statistic."
  });
}

// Rewa Dataset (District code 430)
const rewaData = {
  "source": "pca_state_distt_sc.xls",
  "district_name": "Rewa",
  "district_code": 430,
  "state_code": 23,
  "coordinates": { "lat": 24.5362, "lng": 81.3037 },
  "records": [
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 430,
      "Area Name": "Rewa",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_CL",
      "NCO name": "Cultivators",
      "Total Persons": 5375,
      "Total Males": 3869,
      "Total Females": 1506,
      "Rural Persons": 5375,
      "Rural Males": 3869,
      "Rural Females": 1506,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["farming"],
      "Interest areas": ["agriculture"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    },
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 430,
      "Area Name": "Rewa",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_AL",
      "NCO name": "Agricultural Labourers",
      "Total Persons": 59711,
      "Total Males": 36895,
      "Total Females": 22816,
      "Rural Persons": 59711,
      "Rural Males": 36895,
      "Rural Females": 22816,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["farming"],
      "Interest areas": ["agriculture"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    },
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 430,
      "Area Name": "Rewa",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_HH",
      "NCO name": "Household Industry Workers",
      "Total Persons": 5661,
      "Total Males": 3461,
      "Total Females": 2200,
      "Rural Persons": 5661,
      "Rural Males": 3461,
      "Rural Females": 2200,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["other"],
      "Interest areas": ["business"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    },
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 430,
      "Area Name": "Rewa",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_OT",
      "NCO name": "Other Workers",
      "Total Persons": 12066,
      "Total Males": 9148,
      "Total Females": 2918,
      "Rural Persons": 12066,
      "Rural Males": 9148,
      "Rural Females": 2918,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["other"],
      "Interest areas": ["business"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    }
  ]
};

for (let i = 1; i <= 30; i++) {
  const idStr = String(i).padStart(3, '0');
  const roleName = ratlamTechRoles[(i - 1) % ratlamTechRoles.length];
  const persons = [33, 11, 18, 25, 32, 10, 17, 24, 31, 9, 16, 23, 30, 37, 15, 22, 29, 36, 14, 21, 28, 35, 13, 20, 27, 34, 12, 19, 26, 33][i - 1];
  const males = Math.floor(persons / 2);
  const females = persons - males;
  rewaData.records.push({
    "record_type": "dummy",
    "dummy_id": `TECH_${idStr}`,
    "Table name": "DEMO_DUMMY",
    "State code": 23,
    "District code": 430,
    "Area Name": `Sample Village ${i}`,
    "Division": "DUMMY",
    "Sub-Division": "DUMMY",
    "Group": "DUMMY",
    "Family": "DUMMY",
    "NCO name": roleName,
    "Total Persons": persons,
    "Total Males": males,
    "Total Females": females,
    "Rural Persons": persons,
    "Rural Males": males,
    "Rural Females": females,
    "Urban Persons": 0,
    "Urban Males": 0,
    "Urban Females": 0,
    "Job category": ["technology"],
    "Interest areas": ["technology"],
    "source": "synthetic_demo_data",
    "note": "Dummy record for demo/testing; not an official statistic."
  });
}

for (let i = 31; i <= 60; i++) {
  const idStr = String(i).padStart(3, '0');
  const roleName = ratlamHealthRoles[(i - 31) % ratlamHealthRoles.length];
  const persons = [33, 11, 18, 25, 32, 10, 17, 24, 31, 9, 16, 23, 30, 37, 15, 22, 29, 36, 14, 21, 28, 35, 13, 20, 27, 34, 12, 19, 26, 33][i - 31];
  const males = Math.floor(persons / 2);
  const females = persons - males;
  rewaData.records.push({
    "record_type": "dummy",
    "dummy_id": `HEALTH_${idStr}`,
    "Table name": "DEMO_DUMMY",
    "State code": 23,
    "District code": 430,
    "Area Name": `Sample Village ${i}`,
    "Division": "DUMMY",
    "Sub-Division": "DUMMY",
    "Group": "DUMMY",
    "Family": "DUMMY",
    "NCO name": roleName,
    "Total Persons": persons,
    "Total Males": males,
    "Total Females": females,
    "Rural Persons": persons,
    "Rural Males": males,
    "Rural Females": females,
    "Urban Persons": 0,
    "Urban Males": 0,
    "Urban Females": 0,
    "Job category": ["healthcare"],
    "Interest areas": ["healthcare"],
    "source": "synthetic_demo_data",
    "note": "Dummy record for demo/testing; not an official statistic."
  });
}

for (let i = 61; i <= 90; i++) {
  const idStr = String(i).padStart(3, '0');
  const roleName = ratlamEduRoles[(i - 61) % ratlamEduRoles.length];
  const persons = [33, 11, 18, 25, 32, 10, 17, 24, 31, 9, 16, 23, 30, 37, 15, 22, 29, 36, 14, 21, 28, 35, 13, 20, 27, 34, 12, 19, 26, 33][i - 61];
  const males = Math.floor(persons / 2);
  const females = persons - males;
  rewaData.records.push({
    "record_type": "dummy",
    "dummy_id": `EDU_${idStr}`,
    "Table name": "DEMO_DUMMY",
    "State code": 23,
    "District code": 430,
    "Area Name": `Sample Village ${i}`,
    "Division": "DUMMY",
    "Sub-Division": "DUMMY",
    "Group": "DUMMY",
    "Family": "DUMMY",
    "NCO name": roleName,
    "Total Persons": persons,
    "Total Males": males,
    "Total Females": females,
    "Rural Persons": persons,
    "Rural Males": males,
    "Rural Females": females,
    "Urban Persons": 0,
    "Urban Males": 0,
    "Urban Females": 0,
    "Job category": ["education"],
    "Interest areas": ["education"],
    "source": "synthetic_demo_data",
    "note": "Dummy record for demo/testing; not an official statistic."
  });
}

// Shahdol Dataset (District code 460)
const shahdolData = {
  "source": "pca_state_distt_sc.xls",
  "district_name": "Shahdol",
  "district_code": 460,
  "state_code": 23,
  "coordinates": { "lat": 23.2957, "lng": 81.3577 },
  "records": [
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 460,
      "Area Name": "Shahdol",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_CL",
      "NCO name": "Cultivators",
      "Total Persons": 3305,
      "Total Males": 2448,
      "Total Females": 857,
      "Rural Persons": 3305,
      "Rural Males": 2448,
      "Rural Females": 857,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["farming"],
      "Interest areas": ["agriculture"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    },
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 460,
      "Area Name": "Shahdol",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_AL",
      "NCO name": "Agricultural Labourers",
      "Total Persons": 6898,
      "Total Males": 4089,
      "Total Females": 2809,
      "Rural Persons": 6898,
      "Rural Males": 4089,
      "Rural Females": 2809,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["farming"],
      "Interest areas": ["agriculture"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    },
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 460,
      "Area Name": "Shahdol",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_HH",
      "NCO name": "Household Industry Workers",
      "Total Persons": 1271,
      "Total Males": 735,
      "Total Females": 536,
      "Rural Persons": 1271,
      "Rural Males": 735,
      "Rural Females": 536,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["other"],
      "Interest areas": ["business"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    },
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 460,
      "Area Name": "Shahdol",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_OT",
      "NCO name": "Other Workers",
      "Total Persons": 2655,
      "Total Males": 2060,
      "Total Females": 595,
      "Rural Persons": 2655,
      "Rural Males": 2060,
      "Rural Females": 595,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["other"],
      "Interest areas": ["business"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    }
  ]
};

for (let i = 1; i <= 30; i++) {
  const idStr = String(i).padStart(3, '0');
  const roleName = ratlamTechRoles[(i - 1) % ratlamTechRoles.length];
  const persons = [34, 12, 19, 26, 33, 11, 18, 25, 32, 10, 17, 24, 31, 9, 16, 23, 30, 37, 15, 22, 29, 36, 14, 21, 28, 35, 13, 20, 27, 34][i - 1];
  const males = Math.floor(persons / 2);
  const females = persons - males;
  shahdolData.records.push({
    "record_type": "dummy",
    "dummy_id": `TECH_${idStr}`,
    "Table name": "DEMO_DUMMY",
    "State code": 23,
    "District code": 460,
    "Area Name": `Sample Village ${i}`,
    "Division": "DUMMY",
    "Sub-Division": "DUMMY",
    "Group": "DUMMY",
    "Family": "DUMMY",
    "NCO name": roleName,
    "Total Persons": persons,
    "Total Males": males,
    "Total Females": females,
    "Rural Persons": persons,
    "Rural Males": males,
    "Rural Females": females,
    "Urban Persons": 0,
    "Urban Males": 0,
    "Urban Females": 0,
    "Job category": ["technology"],
    "Interest areas": ["technology"],
    "source": "synthetic_demo_data",
    "note": "Dummy record for demo/testing; not an official statistic."
  });
}

for (let i = 31; i <= 60; i++) {
  const idStr = String(i).padStart(3, '0');
  const roleName = ratlamHealthRoles[(i - 31) % ratlamHealthRoles.length];
  const persons = [34, 12, 19, 26, 33, 11, 18, 25, 32, 10, 17, 24, 31, 9, 16, 23, 30, 37, 15, 22, 29, 36, 14, 21, 28, 35, 13, 20, 27, 34][i - 31];
  const males = Math.floor(persons / 2);
  const females = persons - males;
  shahdolData.records.push({
    "record_type": "dummy",
    "dummy_id": `HEALTH_${idStr}`,
    "Table name": "DEMO_DUMMY",
    "State code": 23,
    "District code": 460,
    "Area Name": `Sample Village ${i}`,
    "Division": "DUMMY",
    "Sub-Division": "DUMMY",
    "Group": "DUMMY",
    "Family": "DUMMY",
    "NCO name": roleName,
    "Total Persons": persons,
    "Total Males": males,
    "Total Females": females,
    "Rural Persons": persons,
    "Rural Males": males,
    "Rural Females": females,
    "Urban Persons": 0,
    "Urban Males": 0,
    "Urban Females": 0,
    "Job category": ["healthcare"],
    "Interest areas": ["healthcare"],
    "source": "synthetic_demo_data",
    "note": "Dummy record for demo/testing; not an official statistic."
  });
}

for (let i = 61; i <= 90; i++) {
  const idStr = String(i).padStart(3, '0');
  const roleName = ratlamEduRoles[(i - 61) % ratlamEduRoles.length];
  const persons = [34, 12, 19, 26, 33, 11, 18, 25, 32, 10, 17, 24, 31, 9, 16, 23, 30, 37, 15, 22, 29, 36, 14, 21, 28, 35, 13, 20, 27, 34][i - 61];
  const males = Math.floor(persons / 2);
  const females = persons - males;
  shahdolData.records.push({
    "record_type": "dummy",
    "dummy_id": `EDU_${idStr}`,
    "Table name": "DEMO_DUMMY",
    "State code": 23,
    "District code": 460,
    "Area Name": `Sample Village ${i}`,
    "Division": "DUMMY",
    "Sub-Division": "DUMMY",
    "Group": "DUMMY",
    "Family": "DUMMY",
    "NCO name": roleName,
    "Total Persons": persons,
    "Total Males": males,
    "Total Females": females,
    "Rural Persons": persons,
    "Rural Males": males,
    "Rural Females": females,
    "Urban Persons": 0,
    "Urban Males": 0,
    "Urban Females": 0,
    "Job category": ["education"],
    "Interest areas": ["education"],
    "source": "synthetic_demo_data",
    "note": "Dummy record for demo/testing; not an official statistic."
  });
}

// Morena Dataset (District code 419)
const morenaSourceOccupations = [
  { name: "Market Oriented Skilled Agricultural and Fishery Workers", persons: 6142, males: 479, females: 5663, rural: 5760, cat: ["farming"], sec: ["agriculture"] },
  { name: "SKILLED AGRICULTURAL AND FISHERY WORKERS", persons: 6142, males: 479, females: 5663, rural: 5760, cat: ["farming"], sec: ["agriculture"] },
  { name: "Market –Oriented Animal Producers and Related Workers", persons: 6036, males: 391, females: 5645, rural: 5666, cat: ["farming"], sec: ["agriculture"] },
  { name: "Dairy and Livestock Producers", persons: 6020, males: 383, females: 5637, rural: 5656, cat: ["farming"], sec: ["agriculture"] },
  { name: "Labourers in Mining, Construction, Manufacturing and Transport", persons: 4740, males: 4604, females: 136, rural: 2442, cat: ["construction"], sec: ["business"] },
  { name: "Mining and Construction Labourers", persons: 4164, males: 4042, females: 122, rural: 2212, cat: ["construction"], sec: ["business"] },
  { name: "Building Construction Labourers", persons: 2804, males: 2749, females: 55, rural: 1544, cat: ["construction"], sec: ["business"] },
  { name: "Construction and Maintenance Labourers, Roads, Dams", persons: 1218, males: 1154, females: 64, rural: 596, cat: ["construction"], sec: ["business"] },
  { name: "Extraction and Building Trades Workers", persons: 779, males: 764, females: 15, rural: 513, cat: ["construction"], sec: ["business"] },
  { name: "Building Frame and Related Trades Workers", persons: 594, males: 588, females: 6, rural: 442, cat: ["construction"], sec: ["business"] },
  { name: "Bricklayer and Stone Masons", persons: 521, males: 515, females: 6, rural: 415, cat: ["construction"], sec: ["business"] },
  { name: "Food and Related Products Machine Operators", persons: 294, males: 289, females: 5, rural: 162, cat: ["cooking"], sec: ["business"] },
  { name: "Agricultural, Fishery and Related Labourers", persons: 146, males: 86, females: 60, rural: 130, cat: ["farming"], sec: ["agriculture"] },
  { name: "Farm Hands and Labourers", persons: 146, males: 86, females: 60, rural: 130, cat: ["farming"], sec: ["agriculture"] },
  { name: "Food Processing and Related Trades Workers", persons: 219, males: 72, females: 147, rural: 129, cat: ["cooking"], sec: ["business"] },
  { name: "Textile, Garment and Related Trades Workers", persons: 347, males: 223, females: 124, rural: 129, cat: ["tailoring"], sec: ["apparel"] },
  { name: "House Keeping and Restaurant Services Workers", persons: 121, males: 20, females: 101, rural: 113, cat: ["cooking"], sec: ["business"] },
  { name: "Tailors, Dress Makers and Hatters", persons: 319, males: 205, females: 114, rural: 109, cat: ["tailoring"], sec: ["apparel"] },
  { name: "Cooks", persons: 115, males: 15, females: 100, rural: 107, cat: ["cooking"], sec: ["business"] },
  { name: "Mining and Quarrying Labourers", persons: 142, males: 139, females: 3, rural: 72, cat: ["construction"], sec: ["business"] },
  { name: "Drivers and Mobile-Plant Operators", persons: 181, males: 180, females: 1, rural: 55, cat: ["driving"], sec: ["business"] },
  { name: "Market Gardners & Crop Growers", persons: 61, males: 51, females: 10, rural: 49, cat: ["farming"], sec: ["agriculture"] },
  { name: "Motor Vehicle Drivers", persons: 170, males: 169, females: 1, rural: 44, cat: ["driving"], sec: ["business"] },
  { name: "Forestry Workers and Loggers", persons: 41, males: 33, females: 8, rural: 41, cat: ["farming"], sec: ["agriculture"] },
  { name: "Street Food Vendors", persons: 64, males: 45, females: 19, rural: 38, cat: ["cooking"], sec: ["business"] },
  { name: "Painters and Related Workers", persons: 72, males: 72, females: 0, rural: 26, cat: ["construction"], sec: ["business"] },
  { name: "Bakers, Pastry-Cooks and Confectionery Makers", persons: 56, males: 48, females: 8, rural: 32, cat: ["cooking"], sec: ["business"] },
  { name: "Miners, Stone Cutters and Carvers", persons: 57, males: 48, females: 9, rural: 25, cat: ["construction"], sec: ["business"] },
  { name: "Hand Pedal Vehicle Drivers", persons: 174, males: 174, females: 0, rural: 22, cat: ["driving"], sec: ["business"] },
  { name: "Street Vendors, Non Food Products", persons: 117, males: 95, females: 22, rural: 21, cat: ["cooking"], sec: ["business"] },
  { name: "Agricultural or Industrial Machinery Mechanics", persons: 51, males: 51, females: 0, rural: 19, cat: ["farming"], sec: ["agriculture"] },
  { name: "Heavy Truck and Lorry Drivers", persons: 53, males: 52, females: 1, rural: 15, cat: ["driving"], sec: ["business"] },
  { name: "Building Finishers and Related Trades Workers", persons: 38, males: 38, females: 0, rural: 14, cat: ["construction"], sec: ["business"] },
  { name: "Weavers, Knitters and Related Workers", persons: 15, males: 6, females: 9, rural: 13, cat: ["tailoring"], sec: ["apparel"] },
  { name: "Shoe Makers and Related Workers", persons: 18, males: 18, females: 0, rural: 12, cat: ["tailoring"], sec: ["apparel"] },
  { name: "Carpenters and Joiners", persons: 51, males: 51, females: 0, rural: 11, cat: ["construction"], sec: ["business"] },
  { name: "Car, Taxi and Van Drivers", persons: 49, males: 49, females: 0, rural: 11, cat: ["driving"], sec: ["business"] },
  { name: "Poultry Producers", persons: 14, males: 6, females: 8, rural: 8, cat: ["farming"], sec: ["agriculture"] },
  { name: "Bus and Tram Drivers", persons: 13, males: 13, females: 0, rural: 7, cat: ["driving"], sec: ["business"] },
  { name: "Sewers, Embroiderers and Related Workers", persons: 7, males: 6, females: 1, rural: 7, cat: ["tailoring"], sec: ["apparel"] },
  { name: "Building and Related Electricians", persons: 23, males: 23, females: 0, rural: 5, cat: ["construction"], sec: ["business"] },
  { name: "Motor Vehicle Mechanics and Fitters", persons: 38, males: 38, females: 0, rural: 6, cat: ["driving"], sec: ["business"] },
  { name: "Dairy Products Makers", persons: 3, males: 3, females: 0, rural: 3, cat: ["farming", "cooking"], sec: ["agriculture", "business"] },
  { name: "Computer Professionals & Computing Tech", persons: 2, males: 0, females: 2, rural: 2, cat: ["computer"], sec: ["technology"] },
  { name: "Plumbers and Pipe Fitters", persons: 1, males: 1, females: 0, rural: 1, cat: ["construction"], sec: ["business"] }
];

const morenaData = {
  "source": "morena_occupation_data.json",
  "district_name": "Morena",
  "district_code": 419,
  "state_code": 23,
  "coordinates": { "lat": 26.4947, "lng": 77.9940 },
  "records": morenaSourceOccupations.map(m => ({
    "Table name": "B0725SCB",
    "State code": 23,
    "District code": 419,
    "Area Name": "Morena",
    "Division": "NCO",
    "Sub-Division": "NCO",
    "Group": "000",
    "Family": "0000",
    "NCO name": m.name,
    "Total Persons": m.persons,
    "Total Males": m.males,
    "Total Females": m.females,
    "Rural Persons": m.rural,
    "Rural Males": Math.floor(m.rural * (m.males / Math.max(1, m.persons))),
    "Rural Females": Math.ceil(m.rural * (m.females / Math.max(1, m.persons))),
    "Urban Persons": Math.max(0, m.persons - m.rural),
    "Urban Males": Math.max(0, m.males - Math.floor(m.rural * (m.males / Math.max(1, m.persons)))),
    "Urban Females": Math.max(0, m.females - Math.ceil(m.rural * (m.females / Math.max(1, m.persons)))),
    "Job category": m.cat,
    "Interest areas": m.sec,
    "record_type": "source_mapped",
    "source": "morena_occupation_data.json",
    "note": "Census 2011 PCA B0725SCB rural Scheduled Caste record."
  }))
};

const morenaTechRoles = [
  "Digital Service Assistant", "Computer Operator", "Data Entry Operator", "IT Support Assistant", "Mobile Repair Technician",
  "Digital Marketing Assistant", "Cyber Cafe Operator", "Web Design Assistant", "Smartphone Service Technician", "CCTV Installation Technician"
];
for (let i = 1; i <= 30; i++) {
  const idStr = String(i).padStart(3, '0');
  const roleName = morenaTechRoles[(i - 1) % morenaTechRoles.length];
  const persons = [12, 19, 26, 33, 40, 47, 8, 15, 22, 29, 36, 43, 50, 11, 18, 25, 32, 39, 46, 7, 14, 21, 28, 35, 42, 49, 10, 17, 24, 31][i - 1];
  const males = Math.floor(persons / 2);
  const females = persons - males;
  morenaData.records.push({
    "record_type": "dummy",
    "dummy_id": `TEC_${idStr}`,
    "Table name": "DEMO_DUMMY",
    "State code": 23,
    "District code": 419,
    "Area Name": `Sample Village ${i}`,
    "Division": "DUMMY",
    "Sub-Division": "DUMMY",
    "Group": "DUMMY",
    "Family": "DUMMY",
    "NCO name": roleName,
    "Total Persons": persons,
    "Total Males": males,
    "Total Females": females,
    "Rural Persons": persons,
    "Rural Males": males,
    "Rural Females": females,
    "Urban Persons": 0,
    "Urban Males": 0,
    "Urban Females": 0,
    "Job category": ["computer", "technology"],
    "Interest areas": ["technology"],
    "source": "synthetic_demo_data",
    "note": "Dummy record for demo/testing; not an official statistic."
  });
}

const morenaHealthRoles = [
  "Community Health Assistant", "Healthcare Support Assistant", "Medical Records Assistant", "Pharmacy Assistant",
  "Home Healthcare Assistant", "Patient Care Assistant", "Health and Wellness Assistant", "Basic First Aid Assistant",
  "Diagnostic Center Assistant", "Hospital Support Assistant"
];
for (let i = 31; i <= 60; i++) {
  const idStr = String(i).padStart(3, '0');
  const roleName = morenaHealthRoles[(i - 31) % morenaHealthRoles.length];
  const persons = [38, 45, 6, 13, 20, 27, 34, 41, 48, 9, 16, 23, 30, 37, 44, 5, 12, 19, 26, 33, 40, 47, 8, 15, 22, 29, 36, 43, 50, 11][i - 31];
  const males = Math.floor(persons / 2);
  const females = persons - males;
  morenaData.records.push({
    "record_type": "dummy",
    "dummy_id": `HEA_${idStr}`,
    "Table name": "DEMO_DUMMY",
    "State code": 23,
    "District code": 419,
    "Area Name": `Sample Village ${i}`,
    "Division": "DUMMY",
    "Sub-Division": "DUMMY",
    "Group": "DUMMY",
    "Family": "DUMMY",
    "NCO name": roleName,
    "Total Persons": persons,
    "Total Males": males,
    "Total Females": females,
    "Rural Persons": persons,
    "Rural Males": males,
    "Rural Females": females,
    "Urban Persons": 0,
    "Urban Males": 0,
    "Urban Females": 0,
    "Job category": ["healthcare"],
    "Interest areas": ["healthcare"],
    "source": "synthetic_demo_data",
    "note": "Dummy record for demo/testing; not an official statistic."
  });
}

const morenaEduRoles = [
  "Community Education Assistant", "Primary Learning Assistant", "Digital Education Facilitator", "School Support Assistant",
  "Adult Literacy Facilitator", "Tuition Support Assistant", "Early Childhood Learning Assistant", "Library Assistant",
  "Vocational Training Assistant", "Student Support Assistant"
];
for (let i = 61; i <= 90; i++) {
  const idStr = String(i).padStart(3, '0');
  const roleName = morenaEduRoles[(i - 61) % morenaEduRoles.length];
  const persons = [18, 25, 32, 39, 46, 7, 14, 21, 28, 35, 42, 49, 10, 17, 24, 31, 38, 45, 6, 13, 20, 27, 34, 41, 48, 9, 16, 23, 30, 37][i - 61];
  const males = Math.floor(persons / 2);
  const females = persons - males;
  morenaData.records.push({
    "record_type": "dummy",
    "dummy_id": `EDU_${idStr}`,
    "Table name": "DEMO_DUMMY",
    "State code": 23,
    "District code": 419,
    "Area Name": `Sample Village ${i}`,
    "Division": "DUMMY",
    "Sub-Division": "DUMMY",
    "Group": "DUMMY",
    "Family": "DUMMY",
    "NCO name": roleName,
    "Total Persons": persons,
    "Total Males": males,
    "Total Females": females,
    "Rural Persons": persons,
    "Rural Males": males,
    "Rural Females": females,
    "Urban Persons": 0,
    "Urban Males": 0,
    "Urban Females": 0,
    "Job category": ["education"],
    "Interest areas": ["education"],
    "source": "synthetic_demo_data",
    "note": "Dummy record for demo/testing; not an official statistic."
  });
}

// Jabalpur Dataset (District Code 457)
const jabalpurData = {
  "source": "pca_state_distt_sc.xls",
  "district_name": "Jabalpur",
  "district_code": 457,
  "state_code": 23,
  "coordinates": { "lat": 23.1815, "lng": 79.9650 },
  "records": [
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 457,
      "Area Name": "Jabalpur",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_CL",
      "NCO name": "Cultivators",
      "Total Persons": 6420,
      "Total Males": 4810,
      "Total Females": 1610,
      "Rural Persons": 6420,
      "Rural Males": 4810,
      "Rural Females": 1610,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["farming"],
      "Interest areas": ["agriculture"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    },
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 457,
      "Area Name": "Jabalpur",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_AL",
      "NCO name": "Agricultural Labourers",
      "Total Persons": 31200,
      "Total Males": 19400,
      "Total Females": 11800,
      "Rural Persons": 31200,
      "Rural Males": 19400,
      "Rural Females": 11800,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["farming"],
      "Interest areas": ["agriculture"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    },
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 457,
      "Area Name": "Jabalpur",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_HH",
      "NCO name": "Household Industry Workers",
      "Total Persons": 1890,
      "Total Males": 1150,
      "Total Females": 740,
      "Rural Persons": 1890,
      "Rural Males": 1150,
      "Rural Females": 740,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["other"],
      "Interest areas": ["business"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    },
    {
      "Table name": "PCA_STATE_DISTT_SC",
      "State code": 23,
      "District code": 457,
      "Area Name": "Jabalpur",
      "Division": "PCA",
      "Sub-Division": "DISTRICT",
      "Group": "000",
      "Family": "MAIN_OT",
      "NCO name": "Other Workers",
      "Total Persons": 12670,
      "Total Males": 9800,
      "Total Females": 2870,
      "Rural Persons": 12670,
      "Rural Males": 9800,
      "Rural Females": 2870,
      "Urban Persons": 0,
      "Urban Males": 0,
      "Urban Females": 0,
      "Job category": ["other"],
      "Interest areas": ["business"],
      "record_type": "source_mapped",
      "source": "pca_state_distt_sc.xls",
      "note": "Mapped from the rural district row in pca_state_distt_sc.xls."
    }
  ]
};

const allDistricts = [ratlamData, rewaData, morenaData, shahdolData, jabalpurData];

async function run() {
  console.log('=== Ingesting and Synchronizing Master PCA SC Census Datasets ===');
  
  // 1. Compile Aggregated District Data for UI
  const aggregatedDistricts = allDistricts.map(dist => {
    let totalSc = 0;
    let ruralSc = 0;
    
    // Pick top key occupations
    const keyOccupations = dist.records.slice(0, 10).map(rec => {
      totalSc += (rec["Total Persons"] || 0);
      ruralSc += (rec["Rural Persons"] || 0);
      return {
        name: rec["NCO name"],
        count: rec["Total Persons"] || rec["Rural Persons"] || 0,
        category: Array.isArray(rec["Job category"]) ? rec["Job category"][0] : "other",
        sector: Array.isArray(rec["Interest areas"]) ? rec["Interest areas"][0] : "business"
      };
    });

    return {
      district_name: dist.district_name,
      district_code: dist.district_code,
      state_code: dist.state_code,
      coordinates: dist.coordinates,
      total_sc_population: totalSc,
      rural_sc_population: ruralSc,
      total_records_count: dist.records.length,
      key_occupations: keyOccupations
    };
  });

  const outputSummaryPath = path.join(__dirname, '../data/census_sc_data.json');
  fs.writeFileSync(outputSummaryPath, JSON.stringify({ districts: aggregatedDistricts }, null, 2));
  console.log(`[File] Written aggregated summary to: ${outputSummaryPath}`);

  // 2. Compile Master Granular Records File
  const masterGranularList = [];
  allDistricts.forEach(dist => {
    dist.records.forEach(rec => {
      masterGranularList.push({
        district_name: dist.district_name,
        district_code: dist.district_code,
        state_code: dist.state_code,
        table_name: rec["Table name"] || "PCA_STATE_DISTT_SC",
        family: rec["Family"] || "",
        nco_name: rec["NCO name"],
        total_persons: rec["Total Persons"] || 0,
        total_males: rec["Total Males"] || 0,
        total_females: rec["Total Females"] || 0,
        rural_persons: rec["Rural Persons"] || 0,
        rural_males: rec["Rural Males"] || 0,
        rural_females: rec["Rural Females"] || 0,
        urban_persons: rec["Urban Persons"] || 0,
        urban_males: rec["Urban Males"] || 0,
        urban_females: rec["Urban Females"] || 0,
        job_category: Array.isArray(rec["Job category"]) ? rec["Job category"] : [rec["Job category"]],
        interest_areas: Array.isArray(rec["Interest areas"]) ? rec["Interest areas"] : [rec["Interest areas"]],
        record_type: rec["record_type"] || "source_mapped",
        dummy_id: rec["dummy_id"] || "",
        source: rec["source"] || dist.source,
        note: rec["note"] || ""
      });
    });
  });

  const outputMasterPath = path.join(__dirname, '../data/master_census_records.json');
  fs.writeFileSync(outputMasterPath, JSON.stringify(masterGranularList, null, 2));
  console.log(`[File] Written ${masterGranularList.length} granular census records to: ${outputMasterPath}`);

  // 3. Sync into live MongoDB Atlas Database
  const uri = config.MONGODB_URI || process.env.MONGODB_URI;
  if (uri) {
    try {
      console.log(`[MongoDB] Connecting to Atlas (${uri.replace(/:([^:@]+)@/, ':****@')})...`);
      await mongoose.connect(uri);
      console.log('[MongoDB] Connected successfully.');

      console.log('[MongoDB] Purging old census documents...');
      await DistrictCensus.deleteMany({});

      console.log(`[MongoDB] Inserting ${masterGranularList.length} complete census documents into Atlas...`);
      await DistrictCensus.insertMany(masterGranularList);
      console.log('🎉 [MongoDB] Atlas districtcensuses collection synced 100%!');

      await mongoose.disconnect();
    } catch (dbErr) {
      console.error('[MongoDB Error]:', dbErr.message);
    }
  } else {
    console.warn('[MongoDB] No MONGODB_URI set. Local JSON store updated.');
  }

  console.log('\n======================================================');
  console.log(`✅ Completed! Processed 5 Districts with ${masterGranularList.length} total Census records.`);
  console.log('Districts: Ratlam (434), Rewa (430), Morena (419), Shahdol (460), Jabalpur (457)');
  console.log('======================================================\n');
}

if (require.main === module) {
  run();
}

module.exports = run;
