const { readMasterKey, CsfleHelper } = require("./helpers");
require("dotenv").config();

const localMasterKey = readMasterKey();
const connectionString = "mongodb://localhost:27017";

const dataKey = "ktELujgWSzCtl/ziM7XVHw==";
const csfleHelper = new CsfleHelper({
  // The client expects a key management system to store and provide the application's master encryption key. For now, we will use a local master key, so they use the local KMS provider.
  kmsProviders: {
    local: {
      key: Buffer.from(localMasterKey, "base64"),
    },
  },
  connectionString,
});

async function main() {
  let regularClient = await csfleHelper.getRegularClient();
  let schemeMap = csfleHelper.createCsfleSchemaMaps(dataKey);
  let csfleClient = await csfleHelper.getCsfleEnabledConnection(schemeMap);

  const regularClientPatientsColl = regularClient
    .db("medicalRecords")
    .collection("patients");
  const csfleClientPatientsColl = csfleClient
    .db("medicalRecords")
    .collection("patients");

  // Performs the insert operation with the csfle-enabled client
  // We're using an update with an upsert so that subsequent runs of this script
  // don't insert new documents
  await csfleClientPatientsColl.updateOne(
    { ssn: exampleDocument["ssn"] },
    { $set: exampleDocument },
    { upsert: true }
  );

  // Performs a read using the encrypted client, querying on an encrypted field
  const csfleFindResult = await csfleClientPatientsColl.findOne({
    ssn: exampleDocument["ssn"],
  });
  console.log(
    "Document retreived with csfle enabled client:\n",
    csfleFindResult
  );

  // Performs a read using the regular client. We must query on a field that is
  // not encrypted.
  // Try - query on the ssn field. What is returned?
  const regularFindResult = await regularClientPatientsColl.findOne({
    name: "Jon Doe",
  });
  console.log("Document retreived with regular client:\n", regularFindResult);

  await regularClient.close();
  await csfleClient.close();
}

main().catch(console.dir);
