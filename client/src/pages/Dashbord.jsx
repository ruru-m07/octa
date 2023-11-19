import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { storage } from "./firebase";
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
  getMetadata,
} from "firebase/storage";
import Codeblock from "../components/Codeblock";
import JSZip from "jszip";

const Dashbord = () => {
  const { user } = useAuth();
  useEffect(() => {
    document.title = `Dashboard • ${user?.name || "user"}`;
  }, []);

  const [progressPercent, setProgressPercent] = useState(0);
  const [filesList, setFilesList] = useState([]);
  const [textContents, setTextContents] = useState({});

  const formatFileSize = (sizeInBytes) => {
    const kilobytes = sizeInBytes / 1024;
    if (kilobytes < 1024) {
      return kilobytes.toFixed(2) + " KB";
    } else {
      const megabytes = kilobytes / 1024;
      return megabytes.toFixed(2) + " MB";
    }
  };

  const fetchFilesList = async () => {
    const storageRef = ref(storage, `files/${user?.username}/${user?.lname}`);
    const files = await listAll(storageRef);

    const filesArray = await Promise.all(
      files.items.map(async (fileRef) => {
        const downloadURL = await getDownloadURL(fileRef);
        const pathArray = fileRef.fullPath.split("/");
        const name = pathArray[pathArray.length - 1];
        const isFolder = fileRef.name !== name; // Check if it's a folder
        const size = await getMetadata(fileRef).then(
          (metadata) => metadata.size
        );

        // Retrieve text content for specific file types (customize as needed)
        const isTextFile = name.endsWith(".txt");
        const textContent = isTextFile ? await getTextContent(fileRef) : null;

        return {
          name,
          isFolder,
          downloadURL: isFolder ? null : downloadURL,
          size,
          textContent,
        };
      })
    );

    const filesArrayWithFormattedSize = filesArray.map((file) => ({
      ...file,
      formattedSize: formatFileSize(file.size),
    }));

    const sortedFilesArray = filesArrayWithFormattedSize.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name);
    });

    setFilesList(sortedFilesArray);
  };

  const getTextContent = async (fileRef) => {
    try {
      const downloadURL = await getDownloadURL(fileRef);
      console.log("Download URL:", downloadURL);
  
      const response = await fetch(downloadURL);
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }
  
      const text = await response.text();
      return text;
    } catch (error) {
      console.error("Error fetching text content:", error);
      return null;
    }
  };
  

  const displayTextContent = async (file) => {
    console.log(file)
    if (file.textContent) {
      setTextContents({
        ...textContents,
        [file.name]: file.textContent,
      });
    }
  };

  useEffect(() => {
    fetchFilesList();
  }, []); // Fetch files list on component mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    const files = e.target[0].files;

    if (!files || files.length === 0) return null;

    const uploadPromises = Array.from(files).map(async (file) => {
      const storageRef = ref(
        storage,
        `files/${user.username}/${user.lname}/${file.name}`
      );

      if (file.name.endsWith(".zip")) {
        const zip = new JSZip();
        await zip.loadAsync(file);

        const filesInZip = Object.keys(zip.files);

        const uploadZipPromises = filesInZip.map(async (fileName) => {
          const content = await zip.files[fileName].async("uint8array");
          const innerStorageRef = ref(
            storage,
            `files/${user.username}/${user.lname}/${fileName}`
          );

          return uploadBytesResumable(innerStorageRef, content);
        });

        return Promise.all(uploadZipPromises);
      } else {
        return uploadBytesResumable(storageRef, file);
      }
    });

    Promise.all(uploadPromises.flat())
      .then(() => {
        e.target[0].value = "";
        console.log("All files uploaded successfully");
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });
  };

  return (
    <div>
      dashboard,
      <h1>welcome {user?.name}</h1>
      <form className="app__form" name="upload_file" onSubmit={handleSubmit}>
        <input type="file" multiple />
        <button type="submit">Upload</button>
      </form>
      <progress value={progressPercent} max="100" />
      <h2>Files in Storage:</h2>
      <ul>
        {filesList.map((file) => (
          <li key={file.name}>
            {file.isFolder ? (
              <strong>{file.name}</strong>
            ) : (
              <>
                <button
                  // href={file.downloadURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => displayTextContent(file)}
                >
                  {file.name} ({file.formattedSize})
                </button>
                {textContents[file.name] && (
                  <div>
                    <strong>Text Content:</strong>
                    <pre>{textContents[file.name]}</pre>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
      {/* <Codeblock /> */}
    </div>
  );
};

export default Dashbord;
