import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-search/css/index.css";
import cupid from "../assets/images/Cupid.svg";
import "../assets/css/steps.less";
import axios from "axios";
// import { Logout } from "../helper/Verifications";
import {
  CloseOutlined,
  PlusOutlined,
  UserOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Steps,
  Button,
  message,
  Form,
  Row,
  Input,
  DatePicker,
  Avatar,
  Modal,
  Radio,
  Tag,
  AutoComplete,
  Col,
} from "antd";
import { Link, useHistory } from "react-router-dom";
import ImageUploading from "react-images-uploading";
import { stepsAction, logoutAction } from "../actions/userAction";
import { Context } from "../Contexts/Context";
import L from "leaflet";
import { COMPLETE } from "../actions/actionTypes";

import {
  openMessageSuccess,
  openMessageWarning,
  openMessageError,
} from "../helper/Verifications";

const { Step } = Steps;
// ?GET IP AND DATA FOR LOCALISATION
const getIP = async () => {
  const ipclient = await axios.get("https://api64.ipify.org/?format=json");
  let ip = ipclient.data.ip;
  let data = await axios.get("http://ip-api.com/json/" + ip);
  return data;
};

const getTags = async () => {
  return new Promise(async (resolve, reject) => {
    await axios
      .get("http://localhost:3001/api/tags/list")
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// ?USE CALLBACK FOR ARRAYS TAGS
function useStateCallback(initialState) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null);

  const setStateCallback = useCallback((state, cb) => {
    cbRef.current = cb;
    setState(state);
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, setStateCallback];
}
// * INFO COMPONNENT
const Info = (props) => {
  const [tags, setTags] = useStateCallback([]);
  const [options, setOptions] = useStateCallback([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [tag, setTag] = useState("");
  const [originalTags, setOriginalTags] = useState([]);

  const dateFormat = "YYYY-MM-DD";

  const handleTagClick = () => {
    setInputVisible(true);
  };
  // eslint-disable-next-line
  useEffect(async () => {
    await getTags().then((data) => {
      let tags = data.map((tag) => {
        return "#" + tag.name;
      });
      setOriginalTags(tags);
      setOptions(
        tags.map((t) => {
          return { value: t };
        })
      );
    });
    // eslint-disable-next-line
  }, []);

  const onSearch = (searchText) => {
    // eslint-disable-next-line
    setTag(searchText);
    // eslint-disable-next-line
    let filtered = originalTags.filter((t) => {
      if (t.startsWith(searchText)) return t;
    });
    if (!searchText) filtered = originalTags;
    if (filtered.length === 0) filtered = [searchText];
    setOptions(
      filtered.map((t) => {
        return { value: t };
      })
    );
  };

  const onSelect = (data) => {
    if (tags.length <= 4) {
      if (!tags.filter((t) => t === data).length)
        setTags([...tags, data], (data) => props.confirm(data));
      setTag("");
      setOptions(
        originalTags.map((t) => {
          return { value: t };
        })
      );
    }
  };

  const removeTag = (tag) => {
    // eslint-disable-next-line
    let usr = props.user.tags;
    // eslint-disable-next-line
    let tags = usr.filter((t) => {
      if (t !== tag) return t;
    });

    setTags(tags, (data) => props.confirm(data));
  };

  return (
    <Form>
      <Row
        gutter={22}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
        }}
        className="infoContainer"
      >
        <Col span={24}>
          <Form.Item label="Gender">
            <Radio.Group
              optionType="button"
              defaultValue={props.user.gender}
              name="gender"
              onChange={(e) => props.handleInfo(e)}
            >
              <Radio.Button value="Male">Male</Radio.Button>
              <Radio.Button value="Female">Female</Radio.Button>
              <Radio.Button value="Other">Other</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Interest">
            <Radio.Group
              optionType="button"
              defaultValue={props.user.interest}
              name="interest"
              onChange={(e) => props.handleInfo(e)}
            >
              <Radio.Button value="Male">Male</Radio.Button>
              <Radio.Button value="Female">Female</Radio.Button>
              <Radio.Button value="Other">Other</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={24} className="inputsContainer" style={{ width: "60%" }}>
          <Form.Item label="Tags">
            {props.user.tags.map((tag, index) => (
              <Tag
                key={tag}
                className="tags"
                width={0.5}
                style={{
                  color: "#fff",
                  marginBottom: "15px",
                  fontSize: "15px",
                  borderRadius: "6px",
                  divor: "white",
                  padding: "5px 13px",
                  boxShadow: "0px 4px 9px rgb(42 139 242 / 20%)",
                  background: "linear-gradient(3deg, #60a9f6 0%, #2a8bf2 100%)",
                }}
                onClose={() => removeTag(tag)}
                closeIcon={<CloseOutlined />}
                closable={true}
              >
                {tag}
              </Tag>
            ))}
            {inputVisible && (
              <AutoComplete
                options={options}
                style={{
                  width: "110px",
                  marginRight: "8px",
                  verticalAlign: "top",
                  marginTop: "2px",
                  height: "30px",
                }}
                value={tag}
                onSelect={onSelect}
                onSearch={onSearch}
                placeholder="Add new tag"
              />
            )}
            {!inputVisible && (
              <Tag className="site-tag-plus" onClick={handleTagClick}>
                <PlusOutlined /> New Tag
              </Tag>
            )}
          </Form.Item>
          <Col md={12} span={24}>
            <Form.Item>
              <DatePicker
                name="birthdate"
                value={props.user.birthday}
                format={dateFormat}
                onChange={(value) => {
                  if (value) props.handleDate(value);
                }}
                placeholder="Birthdate"
                style={{
                  width: "100%",
                  height: "38px",
                  fontSize: "0.8rem",
                  border: "none",
                  borderBottom: "2px solid #d9d9d9",
                  divor: "black",
                }}
              />
            </Form.Item>
          </Col>
          <Form.Item value={props.user.bio}>
            <Input.TextArea
              rows={4}
              value={props.user.bio}
              name="bio"
              onChange={(e) => props.handleInfo(e)}
              allowClear
              showCount
              maxLength={100}
              placeholder="Description"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

const Pictures = (props) => {
  const [profile, setProfile] = useState("");

  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    if (!gallery.length && props.user.gallery.length)
      setGallery(
        props.user.gallery.map((g) => {
          let obj = {
            dataURL: URL.createObjectURL(g),
            file: g,
          };
          return obj;
        })
      );
    if (profile === "" && props.user.profile !== "")
      setProfile(URL.createObjectURL(props.user.profile[0]));
    // eslint-disable-next-line
  }, []);

  const profileUpload = useRef(null);
  const galleryUpload = useRef(null);

  const handleProfileUpload = (e) => {
    props.handleProfileimage(e);
    setProfile(e[0].dataURL);
  };
  const handleGalleryUpload = (e) => {
    setGallery(e);
    props.handleGallery(e);
  };

  return (
    <>
      {/* Profile */}
      <ImageUploading
        name="profile"
        onChange={handleProfileUpload}
        maxNumber={1}
      >
        {({ onImageUpload, onImageUpdate }) => (
          <div className="upload__image-wrapper">
            <Button
              ref={profileUpload}
              style={{ display: "none" }}
              onClick={profile === "" ? onImageUpdate : onImageUpdate}
              // {...dragProps}
            />
          </div>
        )}
      </ImageUploading>
      <div className="profileImg">
        <div>
          {profile === "" ? (
            <Avatar
              size={200}
              icon={<UserOutlined />}
              style={{ width: "100%", height: "100%" }}
              onClick={() => profileUpload.current.click()}
            />
          ) : (
            <img
              onClick={() => profileUpload.current.click()}
              src={profile}
              alt="..."
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}
        </div>
      </div>
      {/* gallery */}
      <ImageUploading
        multiple
        name="gallery"
        value={gallery}
        onChange={handleGalleryUpload}
        maxNumber={4}
      >
        {({ onImageUpload, onImageRemove, imageList }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <Button
              ref={galleryUpload}
              style={{ display: "none" }}
              onClick={onImageUpload}
            >
              Upload image for gallery
            </Button>

            <div className="listImage">
              {imageList.map((image, key) => (
                <div className="tte" key={key}>
                  <img
                    src={image.dataURL}
                    alt="..."
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                    }}
                  />
                  <div className="removeImg" onClick={() => onImageRemove(key)}>
                    <DeleteOutlined
                      style={{ fontSize: "30px", color: "#b5b5b5" }}
                    />
                  </div>
                </div>
              ))}
              {gallery.length < 4 ? (
                <div
                  onClick={() => galleryUpload.current.click()}
                  className="uploadNextImage"
                >
                  <p>+ Upload Image</p>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </ImageUploading>
    </>
  );
};

const Location = (props) => {
  // eslint-disable-next-line
  useEffect(async () => {
    navigator.geolocation.getCurrentPosition(() => "");
    let data = await getIP();

    if (navigator.geolocation) {
      props.setLocation(data.data);
    } else {
      props.setLocation(data.data);
    }
    // eslint-disable-next-line
  }, []);

  const position = [props.user.lat, props.user.lang];

  L.Icon.Default.imagePath = "img/";

  return (
    <>
      <Form.Item>
        <Map
          style={{ height: "500px", width: "100wh" }}
          center={position}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              We see you <br /> You are here.
            </Popup>
          </Marker>
        </Map>
      </Form.Item>
    </>
  );
};

const steps = [
  {
    title: "Info",
    content: (user, confirm, handleInfo, setDate) => (
      <Info
        user={user}
        handleInfo={handleInfo}
        handleDate={setDate}
        confirm={confirm}
      />
    ),
  },
  {
    title: "Pictures",
    content: (user, handleGallery, handleProfileimage) => (
      <Pictures
        user={user}
        handleGallery={handleGallery}
        handleProfileimage={handleProfileimage}
      />
    ),
  },
  {
    title: "Location",
    content: (user, setLocation) => (
      <Location user={user} setLocation={setLocation} />
    ),
  },
];
// !PARENT COMPONENT
const CompleteProfile = () => {
  const [visible, setVisible] = useState(false);
  const { state, dispatch } = useContext(Context);
  const [current, setCurrent] = useState(0);
  let history = useHistory();
  const [user, setUser] = useState({
    gender: "",
    interest: "",
    tags: [],
    birthday: "",
    bio: "",
    profile: "",
    gallery: [],
    lat: 0,
    lang: 0,
    country: "",
    city: "",
    validation: 0,
  });

  const submit = async () => {
    const res = await stepsAction(state.token, user, dispatch);

    message.loading("Loading...", 2);
    if (res.success) {
      dispatch({
        type: COMPLETE,
        payload: {
          success: true,
          isCompletinfo: true,
        },
      });
      openMessageSuccess(res.message);
      history.push("/home");
    } else {
      openMessageError(res.error);
    }
  };
  //* SET INFO IN USER STATE
  const handleInfo = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const setStepOne = (data) => {
    setUser({
      ...user,
      tags: data,
    });
  };
  const setDate = (birthdate) => {
    setUser({
      ...user,
      birthday: birthdate,
    });
  };
  // * SET PICTURES IN USER STATE
  const handleGallery = (gallery) => {
    const files = gallery.map((pic) => {
      return pic.file;
    });
    setUser({
      ...user,
      gallery: files,
    });
  };
  const handleProfileimage = (gallery) => {
    const files = gallery.map((pic) => {
      return pic.file;
    });
    setUser({
      ...user,
      profile: files,
    });
  };
  // * SET LOCATION IN USER STATE
  const setLocation = (info) => {
    setUser({
      ...user,
      lat: info.lat,
      lang: info.lon,
      country: info.country,
      city: info.city,
    });
  };

  // * VALIDATE STEPS
  const validateStep = (step) => {
    if (step === 0) {
      if (
        user.gender !== "" &&
        user.interest !== "" &&
        user.tags.length > 0 &&
        user.birthday !== "" &&
        user.bio.length >= 10
      )
        return true;
    } else if (step === 1) {
      if (
        (user.profile !== "" && user.gallery !== "") ||
        (user.profile !== "" && user.gallery === "")
      ) {
        return true;
      }
    } else if (step === 2) {
      if (
        user.city !== "" &&
        user.country !== "" &&
        user.lat !== "" &&
        user.lang !== ""
      )
        return true;
    }
    return false;
  };

  const next = () => {
    if (validateStep(current)) {
      setUser({ ...user, validation: 0 });
      if (current + 1 !== 3) {
        message.loading("Loading...", 2);
        openMessageWarning("one more ...");
      }

      setCurrent(current + 1);
    } else {
      setUser({ ...user, validation: 1 });
      message.loading("Loading...", 2);
      openMessageError(
        current + 1 === 2
          ? "Your must choose at least the profile picture"
          : "You Must Complet Your in🤪fo "
      );
    }
  };
  const Logout = async () => {
    await logoutAction(state.id, dispatch);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <div
        style={{
          alignItems: "center",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <img
          style={{
            width: "100%",
            maxWidth: "800px",
            marginBottom: "60px",
            marginTop: "0",
          }}
          id="img"
          alt="login svg"
          src={cupid}
        />
        <div>
          <Button
            type="primary"
            onClick={() => setVisible(true)}
            style={{ fontSize: "0.7rem" }}
          >
            Complete profile !
          </Button>
        </div>
        <div style={{ marginTop: "12px" }}>
          <Link to="/">
            <Button
              type="primary"
              onClick={Logout}
              style={{ fontSize: "0.7rem" }}
            >
              Logout
            </Button>{" "}
          </Link>
        </div>
      </div>
      <Modal
        title="Dear, Complete your profile !"
        centered
        footer={null}
        visible={visible}
        onCancel={() => setVisible(false)}
        width="70%"
        style={{ height: "100%" }}
        className="stepsContainer"
      >
        <Steps current={current} className="stepsTitles">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} className="stepsTitle" />
          ))}
        </Steps>
        <div className="steps-content">
          {current === 0
            ? steps[current].content(user, setStepOne, handleInfo, setDate)
            : ""}
          {current === 1
            ? steps[current].content(user, handleGallery, handleProfileimage)
            : ""}
          {current === 2 ? steps[current].content(user, setLocation) : ""}
        </div>

        <div className="steps-action" style={{ textAlign: "center" }}>
          {current > 0 && (
            <Button
              style={{ fontSize: "10px", marginLeft: "8px" }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              style={{ fontSize: "10px" }}
              type="primary"
              onClick={() => submit()}
            >
              Done
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
              style={{ fontSize: "10px" }}
              type="primary"
              onClick={() => next()}
            >
              Next
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default CompleteProfile;
