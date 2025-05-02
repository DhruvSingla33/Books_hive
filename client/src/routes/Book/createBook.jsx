import React, { useState } from "react";
import NoImageSelected from "../../assets/no-image-selected.jpg";
const BASE_URL = "https://dev-minds-1.onrender.com";
const endpoint = "/api/books";

function CreateBook() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [pdf, setPdf] = useState(null); 
  const [submitted, setSubmitted] = useState(null); // null = not submitted, true = success, false = failure
  const [image, setImage] = useState(NoImageSelected);
  const [book_author, setBookAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  const createBook = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!title || !book_author || !description || categories.length === 0 || !thumbnail ) {
      alert("Please fill in all fields and upload required files.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("book_author", book_author);
    formData.append("description", description);
    formData.append("category", categories);
    formData.append("thumbnail", thumbnail);
    formData.append("pdf", pdf);

    setLoading(true);
    setSubmitted(null);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setTitle("");
        setBookAuthor("");
        setDescription("");
        setCategories([]);
        setThumbnail(null);
        setPdf(null);
        setImage(NoImageSelected);
        setSubmitted(true);
      } else {
        console.log("Failed to submit data.");
        setSubmitted(false);
      }
    } catch (error) {
      console.log(error);
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const inputCategories = e.target.value;
    const categoriesArray = inputCategories.split(',').map(category => category.trim());
    setCategories(categoriesArray);
  };

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("Thumbnail image size should not exceed 2MB.");
        return;
      }
      setImage(URL.createObjectURL(file));
      setThumbnail(file);
    }
  };

  const onPdfChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        alert("Please upload a valid PDF file.");
        return;
      }
      setPdf(file);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px",  display: "flex",
      justifyContent: "center",
      }}>
      <h1 style={{ textAlign: "center", color: "#4CAF50" }}>Create Book</h1>

      {submitted === true ? (
        <p style={{ color: "green", textAlign: "center" }}>Data submitted successfully!</p>
      ) : submitted === false ? (
        <p style={{ color: "red", textAlign: "center" }}>Something went wrong. Please try again.</p>
      ) : (
        <form className="bookdetails" onSubmit={createBook} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <label style={{ fontSize: "16px", marginBottom: "10px", display: "block" }}>Upload Thumbnail</label>
            <img src={image} alt="preview" style={{ width: "200px", height: "auto", borderRadius: "8px", marginBottom: "10px" }} />
            <input 
              type="file"
              accept="image/gif, image/jpeg, image/png"
              onChange={onImageChange}
              style={{ marginBottom: "20px" }}
            />

            <label style={{ fontSize: "16px", marginBottom: "10px", display: "block" }}>Upload PDF</label>
            <input 
              type="file"
              accept="application/pdf"
              onChange={onPdfChange}
              style={{ marginBottom: "20px" }}
            />
            {pdf && <p style={{ fontSize: "14px", color: "#555" }}>{pdf.name}</p>} {/* Display PDF file name */}
          </div>

          <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: "500px" }}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "16px", display: "block" }}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ padding: "10px", width: "100%", borderRadius: "5px", border: "1px solid #ddd", fontSize: "14px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "16px", display: "block" }}>Book Author</label>
              <input
                type="text"
                value={book_author}
                onChange={(e) => setBookAuthor(e.target.value)}
                required
                style={{ padding: "10px", width: "100%", borderRadius: "5px", border: "1px solid #ddd", fontSize: "14px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "16px", display: "block" }}>Description</label>
              <textarea
                rows="4"
                cols="50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ padding: "10px", width: "100%", borderRadius: "5px", border: "1px solid #ddd", fontSize: "14px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "16px", display: "block" }}>Categories (comma-separated)</label>
              <input
                type="text"
                value={categories}
                onChange={handleCategoryChange}
                required
                style={{ padding: "10px", width: "100%", borderRadius: "5px", border: "1px solid #ddd", fontSize: "14px" }}
              />
            </div>

            <input 
              type="submit" 
              style={{
                cursor: "pointer", 
                padding: "12px", 
                backgroundColor: "#4CAF50", 
                color: "white", 
                border: "none", 
                borderRadius: "5px", 
                fontSize: "16px", 
                marginBottom: "20px"
              }} 
              disabled={loading}
            />
          </div>
        </form>
      )}

      {loading && <p style={{ textAlign: "center", color: "#4CAF50" }}>Loading...</p>}
    </div>
  );
}

export default CreateBook; 