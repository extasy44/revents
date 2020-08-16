import React, { useState } from "react";
import cuid from "cuid";
import { toast } from "react-toastify";
import { Grid, Header, Button } from "semantic-ui-react";
import PhotoWidgetDropZone from "./PhotoWidgetDropZone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import { getFileExtension } from "../utils/util";
import { uploadToFirebaseStorage } from "../../firestore/firebaseService";
import { updateUserProfilePhoto } from "../../firestore/firestoreService";

const PhotoUploadWidget = ({ setEditMode }) => {
  const [files, setFiles] = useState([]);
  // eslint-disable-next-line
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUploadImage = () => {
    setLoading(true);
    const filename = cuid() + "." + getFileExtension(files[0].name);
    const uploadTask = uploadToFirebaseStorage(image, filename);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        toast.error(error.message);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          updateUserProfilePhoto(downloadURL, filename)
            .then(() => {
              setLoading(false);
              handleCancelCrop();
              setEditMode(false);
            })
            .catch((error) => {
              toast.error(error.message);
              setLoading(false);
            });
        });
      }
    );
  };

  const handleCancelCrop = () => {
    setFiles([]);
    setImage(null);
  };

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header color="teal" sub content="Step 1 - Add Photo" />
        <PhotoWidgetDropZone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header color="teal" sub content="Step 2 - Resize" />
        {files.length > 0 && (
          <PhotoWidgetCropper
            setImage={setImage}
            imagePreview={files[0].preview}
          />
        )}
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header color="teal" sub content="Step 3 - Preview & upload" />
        {files.length > 0 && (
          <>
            <div
              className="img-preview"
              style={{
                minHeight: 200,
                minWidth: 200,
              }}
            />
            <Button.Group>
              <Button
                style={{ width: 100 }}
                positive
                icon="check"
                onClick={handleUploadImage}
                loading={loading}
              />
              <Button
                style={{ width: 100 }}
                icon="close"
                onClick={handleCancelCrop}
                disabled={loading}
              />
            </Button.Group>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default PhotoUploadWidget;