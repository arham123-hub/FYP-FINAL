import connectAndQuery from "../configuration/db.js";

const fetchDataFromCustomerTable = async () => {
  try {
    const query = "SELECT * FROM Customers";
    const result = await connectAndQuery(query);
    return result;
  } catch (err) {
    throw new Error("Error fetching data:", err);
  }
};

export default fetchDataFromCustomerTable;
