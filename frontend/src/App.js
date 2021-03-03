import { useEffect, useState } from "react";
import "./App.css";
import FileList from "./Components/FileList";

function App() {
  const [file, setFile] = useState();
  const [list, setList] = useState([]);
  const [error, setError] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    fetch(`${process.env.React_App_BACKEND_URL}/data`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setError(res.error);
          return;
        } else {
          setError();
          console.log(res);
          setList(res);
        }
      });
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (file === undefined) {
      setError("Please select a file to upload");
      return;
    } else {
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("fileName", file.name);

      fetch(`${process.env.React_App_BACKEND_URL}/newfile`, {
        method: "post",
        body: formdata,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            setError(res.error);
          } else {
            setError();
            setMessage(res.message);
            setList(res.body);
          }
        });
    }
  };

  const downloadHandler = (fileName) => {
    fetch(`${process.env.React_App_BACKEND_URL}/download/${fileName}`)
      // 1. Convert the data into 'blob'
      .then((res) => res.blob())
      .then((blob) => {
        // 2. Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName); // 3. Append to html page
        document.body.appendChild(link); // 4. Force download
        link.click(); // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  };

  const deleteHandler = (id) => {
    // console.log(id);
    fetch(`${process.env.React_App_BACKEND_URL}/delete/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setError(res.error);
        } else {
          setError();
          setList(res.body);
          setMessage(res.message);
        }
      });
  };

  const getData = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input type="file" name="file" onChange={getData} />
        <input type="submit" value="upload" />
      </form>

      <br />
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="success">{message}</div>
      )}
      <br />
      <br />
      <FileList
        list={list}
        downloadHandler={downloadHandler}
        deleteHandler={deleteHandler}
      />
    </div>
  );
}

export default App;