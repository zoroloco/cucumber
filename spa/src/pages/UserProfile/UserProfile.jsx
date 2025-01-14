import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";
import Form from "react-bootstrap/form";
import Button from "react-bootstrap/Button";
import config from "../../config";

export const UserProfile = () => {
  const { accessToken, user, isLoading } = useContext(AuthContext);
  const [showContent, setShowContent] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setShowContent(!isLoading);
  }, [isLoading]);

  const updateUserProfileHandler = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        config.resourceServer + "/api/update-user-profile-image-for-user",
        {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (response.status === 201) {
        console.log("Successfully updated user.");
      } else {
        console.error("Error encountered while udpating user.");
      }
    } catch (error) {
      console.error("Error encountered while updating user:" + error);
    }
  };

  return (
    <div>
      {showContent ? (
        <div>
          <Form className="rounded p-4 p-sm-3">
            <Form.Text>{user.username}</Form.Text>
            <br />
            <br />
            <Form.Group controlId="formFile">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(event) => {
                  setFile(event.target.files[0]);
                }}
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="dark"
                size="lg"
                onClick={updateUserProfileHandler}
              >
                [Submit]
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <div>Please wait...</div>
      )}
    </div>
  );
};
