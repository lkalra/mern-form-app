import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState([]);
  const [base64Image, setBase64Image] = useState("");

  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [streetAddress, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  console.log(formData);
  useEffect(() => {
    //will fetch data from the server on component mount
    axios
      .get("http://localhost:8000/api/form")
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("photo", photo);
    formData.append("state", state);
    formData.append("country", country);
    formData.append("phone", phone);
    formData.append("city", city);
    formData.append("streetAddress", streetAddress);
    // console.log(formData.data)
    axios
      .post("http://localhost:8000/api/form", formData)
      .then(() => {
        // will refresh the data after successful form submission
        axios
          .get("http://localhost:8000/api/form")
          .then((response) => {
            setFormData(response.data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };
  const exportToCSV = () => {
    // export data to CSV format
    const csvContent = Object.values(formData).join(",");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "formData.csv";
    link.click();
  };

  const handleExportCSV = () => {
    axios
      .get("http://localhost:8000/api/export-csv")
      .then((response) => {
        // to download of the CSV file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "exported_data.csv");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error exporting data to CSV:", error);
      });
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>MERN Form App</h1>
      <form method="POST" onSubmit={handleFormSubmit}>
        <label>
          Photo:
          <input
            style={{ marginTop: "10px" }}
            type="file"
            accept=".jpg"
            // value={photo}
            onChange={handleFileChange}
            required
          />
        </label>
        <br />
        <label>
          Name:
          <input
            style={{ marginTop: "10px" }}
            type="text"
            value={name}
            maxLength="25"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Phone:
          <input
            style={{ marginTop: "10px" }}
            type="tel"
            value={phone}
            pattern="^\+1-\(\d{3}\) \d{3}-\d{4}$"
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            style={{ marginTop: "10px" }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Street Address:
          <input
            style={{ marginTop: "10px" }}
            type="text"
            value={streetAddress}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          City:
          <input
            style={{ marginTop: "10px" }}
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          State:
          <select
            style={{ margin: "10px 0 0 0 " }}
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          >
            <option value="CA">CA</option>
            <option value="NY">NY</option>
            <option value="AT">AT</option>
          </select>
        </label>
        <br />
        <label>
          Country:
          <select
            style={{ margin: "10px 0 0 0 " }}
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            <option value="IN">IN</option>
            <option value="US">US</option>
            <option value="EU">EU</option>
          </select>
        </label>
        <br />
        <div style={{ display: "flex", justifyContent: "spaceBetween" }}>
          <button
            style={{ margin: "10px", padding: "0.3rem 0.7rem" }}
            type="submit"
          >
            Submit
          </button>
          <button
            style={{ margin: "10px", padding: "0.3rem 0.7rem" }}
            onClick={handleExportCSV}
          >
            Export in CSV
          </button>
        </div>
      </form>

      <h2>Form Data</h2>
      <ul>
        {formData.data?.map((item) => (
          <li key={item._id}>
            <p>
              <strong>Name</strong>: {item.name}
            </p>
            <p>
              <strong>Email</strong>: {item.email}
            </p>
            <p>
              <strong>phone</strong>: {item.phone}
            </p>
            <p>
              <strong>streetAddress</strong>: {item.streetAddress}
            </p>
            <p>
              <strong>city</strong>: {item.city}
            </p>
            <p>
              <strong>state</strong>: {item.state}
            </p>
            <p>
              <strong>country</strong>: {item.country}
            </p>
            <p>
              <strong>Photo</strong>:
              <img
                src={`http://localhost:8000/uploads/${item.photo}`}
                style={{ height: "100px", width: "100px" }}
                alt=""
              ></img>
            </p>
          </li>
        ))}
      </ul>
      {/* <button onClick={exportToCSV}>Export to CSV</button> */}
    </div>
  );
}

export default App;
