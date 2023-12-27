const { mongoClient } = require("./mongoConnection");

async function getDocuments(collectionName, filter = {}) {
  try {
    const documents = await mongoClient()
      .db()
      .collection(collectionName)
      .find(filter)
      .toArray();
    return documents;
  } catch (error) {
    console.error("Error retrieving documents:", error);
    throw error;
  }
}

async function insertDocument(collectionName, document) {
  try {
    const result = await mongoClient()
      .db()
      .collection(collectionName)
      .insertOne(document);
    return result?.acknowledged;
  } catch (error) {
    console.error("Error inserting document:", error);
    throw error;
  }
}

async function updateDocument(collectionName, filter, updateDoc) {
  try {
    const result = await mongoClient()
      .db()
      .collection(collectionName)
      .updateOne(filter, { $set: updateDoc });
    return result;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

async function deleteDocument(collectionName, filter) {
  try {
    const result = await mongoClient()
      .db()
      .collection(collectionName)
      .deleteOne(filter);
    return result.deletedCount;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}

module.exports = {
  insertDocument,
  deleteDocument,
  updateDocument,
  getDocuments,
};
