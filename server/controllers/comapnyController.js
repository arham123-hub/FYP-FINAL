import connectAndQuery from "../configuration/db.js";

const fetchDataFromCompaniesTable = async () => {
  try {
    const query = "SELECT * FROM Companies";
    const result = await connectAndQuery(query);
    return result;
  } catch (err) {
    throw new Error("Error fetching companies data:", err);
  }
};

export default fetchDataFromCompaniesTable;
