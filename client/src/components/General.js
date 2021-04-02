import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Avatar,
  Form,
  Input,
  Tag,
  DatePicker,
  Radio,
  Row,
  Col,
  Button,
  Divider,
  AutoComplete,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";
import {
  UserOutlined,
  PlusOutlined,
  CloseOutlined,
  MailOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "leaflet/dist/leaflet.css";
import "react-leaflet-search/css/index.css";
import "../assets/css/general.less";
import { Context } from "../Contexts/Context";
import moment from "moment";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import Search from "react-leaflet-search";
import "leaflet/dist/leaflet.css";
import "react-leaflet-search/css/index.css";
import L from "leaflet";
import ImageUploading from "react-images-uploading";
import {
  infoUpdate,
  changeLocation,
  changeProfile,
  changeGallery,
  removeGallery,
} from "../actions/editActions";

import { openMessageSuccess, openMessageError } from "../helper/Verifications";

export const General = () => {
  const { state, dispatch } = useContext(Context);

  //! Informations
  const [userInfos, setUserInfos] = useState({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    gender: "",
    looking: "",
    birthday: "",
    bio: "",
    tags: [],
  });
  // !Pictures
  const [userPictures, setUserPictures] = useState({
    profile: [],
    gallery: [],
  });
  // !Location
  const [userLocation, setUserLocation] = useState({
    lang: "",
    lat: "",
    country: "",
    city: "",
  });
  const [originalTags, setOriginalTags] = useState([]);
  const [tags, setTags] = useStateCallback([]);
  const [options, setOptions] = useStateCallback([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [tag, setTag] = useState("");
  const dateFormat = "YYYY-MM-DD";
  const [form] = Form.useForm();

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

    let userData = await getUser();

    userData.tags = userData.tags.map((tag) => "#" + tag.name);

    userData.profile = userData.images.reduce((arr, i) => {
      if (i.profile === 1)
        arr.push({ dataURL: "http://localhost:3001/api/" + i.url });
      return arr;
    }, []);
    // eslint-disable-next-line
    userData.images = userData.images.filter((i) => {
      if (i.profile === 0) return "http://localhost:3001/api/" + i.url;
    });

    userData.birthday = moment(userData.birthday);

    form.setFieldsValue({
      birthday: userData.birthday,
      firstname: userData.firstname,
      lastname: userData.lastname,
      username: userData.username,
      bio: userData.bio,
      email: userData.email,
      tags: userData.tags,
      gender: userData.gender,
      looking: userData.looking,
    });
    setUserInfos({
      birthday: userData.birthday,
      firstname: userData.firstname,
      lastname: userData.lastname,
      username: userData.username,
      bio: userData.bio,
      email: userData.email,
      tags: userData.tags,
      gender: userData.gender,
      looking: userData.looking,
    });

    setTags(userData.tags);

    setUserLocation({
      lat: userData.lat,
      lang: userData.lang,
      country: userData.country,
      city: userData.city,
    });
    setUserPictures({ profile: userData.profile, gallery: userData.images });
    // eslint-disable-next-line
  }, []);

  // ? GET USER INFO
  const getUser = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
    };
    let user = await axios.get(
      "http://localhost:3001/api/users/find/profile",
      config
    );

    return { ...user.data };
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

  const handleTagClick = () => {
    setInputVisible(true);
  };

  const onSearch = (searchText) => {
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
    if (userInfos.tags.length <= 4) {
      if (!tags.filter((t) => t === data).length)
        setTags([...tags, data], (data) =>
          setUserInfos({ ...userInfos, tags: data })
        );
      setTag("");
      setOptions(
        originalTags.map((t) => {
          return { value: t };
        })
      );
    }
  };

  const removeTag = (tag) => {
    if (userInfos.tags.length === 1) {
    }
    // eslint-disable-next-line
    let tagsd = tags.filter((t) => {
      if (t !== tag) return t;
    });
    setTags(tagsd, (data) => setUserInfos({ ...userInfos, tags: data }));
  };

  const handleUserUpdate = (e) => {
    setUserInfos({
      ...userInfos,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserDate = (val) => {
    setUserInfos({
      ...userInfos,
      bithday: val,
    });
  };

  // * Submit data info edited for user
  const SubmitInfo = async () => {
    const token = localStorage.getItem("token");
    const res = await infoUpdate(token, userInfos, dispatch);
    message.loading("Loading...", 2);
    if (res.success) {
      openMessageSuccess(res.message);
    } else {
      openMessageError(res.error);
    }
  };

  // * Submit location data
  const submitLocation = async () => {
    const token = localStorage.getItem("token");
    const res = await changeLocation(token, userLocation);
    message.loading("Loading...", 2);
    if (res.success) {
      openMessageSuccess(res.message);
    } else {
      openMessageError(res.error);
    }
  };
  // * Submit Profile
  const uploadProfileReq = async ([{ file }]) => {
    const res = await changeProfile(state.token, file);

    message.loading("Loading...", 2);
    if (res.success) {
      openMessageSuccess(res.message);
    } else {
      openMessageError(res.error);
    }
  };
  // * Submit Gallery
  const uploadGalleryReq = async ({ file }) => {
    const res = await changeGallery(state.token, file);

    message.loading("Loading...", 2);
    if (res.success) {
      openMessageSuccess(res.message);
      return res.data;
    } else {
      openMessageError(res.error);
      return false;
    }
  };
  // * confirm remove images
  async function confirm(id) {
    const res = await removeGallery(state.token, id);

    message.loading("Loading...", 2);
    if (res.success) {
      const newArray = userPictures.gallery.filter((obj) => {
        return obj.id !== id;
      });
      setUserPictures({ profile: userPictures.profile, gallery: newArray });
      openMessageSuccess(res.message);
    } else {
      openMessageError(res.error);
    }
  }
  // * Cancel remove images
  function cancel() {
    message.error("Click on No");
  }

  const galleryUpload = useRef(null);

  const handleProfileUpload = async (e) => {
    setUserPictures({ ...userPictures, profile: e });
    uploadProfileReq(e);
  };

  const handleGalleryUpload = async (e) => {
    const res = await uploadGalleryReq(e[e.length - 1]);
    if (res) {
      e[e.length - 1] = res;
      setUserPictures({ ...userPictures, gallery: e });
    }
  };

  const position = [userLocation.lat, userLocation.lang];

  const newLocation = (e) => {
    setUserLocation({
      lat: `${e.latLng.lat}`,
      lang: `${e.latLng.lng}`,
      city: e.raw[0].address.city || e.raw[0].address.county,
      country: e.raw[0].address.country,
    });
  };

  const SearchComponent = () => (
    <Search
      position="topleft"
      provider="OpenStreetMap"
      onChange={newLocation}
    />
  );
  L.Icon.Default.imagePath = "img/";

  let rules = {
    firstname: [
      { max: 30, message: "The firstname is too long !" },
      {
        pattern: new RegExp(/^[A-Za-z]{3,}$/),
        message:
          "The FirstName must be contains letters only at least 3 letters !",
      },
    ],
    lastname: [
      { max: 30, message: "The lastname is too long !" },
      {
        pattern: new RegExp(/^[A-Za-z]{3,}$/),
        message:
          "The lastname must be contains letters only at least 3 letters !",
      },
    ],
    username: [
      {
        max: 20,
        min: 3,
        message: "The username should be between 3 and 20 characters !",
      },
      {
        pattern: new RegExp(/^[a-zA-Z]+(([-_.]?[a-zA-Z0-9])?)+$/),
        message:
          "The username must be contains letters or numbers ( -, _ or . ) !",
      },
    ],
    email: [
      {
        pattern: new RegExp(
          /[a-zA-Z0-9-_.]{1,50}@[a-zA-Z0-9-_.]{1,50}\.[a-z0-9]{2,10}$/
        ),
        message: "Invalid email address !",
      },
    ],
  };
  return (
    <div id="general">
      <ImageUploading
        name="profile"
        value={userPictures.profile}
        onChange={(e) => {
          handleProfileUpload(e);
        }}
        maxNumber={1}
      >
        {({ onImageUpdate, imageList }) => (
          <div className="upload__image-wrapper">
            <div className="profileImg">
              <div style={{ textAlign: "center" }}>
                {!imageList.length ? (
                  <Avatar
                    size={200}
                    icon={<UserOutlined />}
                    style={{ width: "150px", height: "150px" }}
                    onClick={onImageUpdate}
                  />
                ) : (
                  <>
                    <Avatar
                      size={200}
                      src={imageList[0].dataURL}
                      style={{ width: "150px", height: "150px" }}
                      onClick={onImageUpdate}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </ImageUploading>
      <Divider orientation="center" style={{ margin: "50px 0px" }}>
        Informations
      </Divider>

      <Form initialValues={userInfos} form={form}>
        <Row
          type="flex"
          style={{ justifyContent: "space-evenly", marginBottom: 10 }}
        >
          <Col md={11} span={24}>
            <Form.Item name="firstname" rules={rules.firstname}>
              <Input
                prefix={<UserOutlined />}
                name="firstname"
                onChange={(e) => handleUserUpdate(e)}
                placeholder="Firstname"
              ></Input>
            </Form.Item>
          </Col>
          <Col md={11} span={24}>
            <Form.Item name="lastname" rules={rules.lastname}>
              <Input
                prefix={<UserOutlined />}
                name="lastname"
                onChange={(e) => handleUserUpdate(e)}
                placeholder="Lastname"
              ></Input>
            </Form.Item>
          </Col>
        </Row>
        <Row
          type="flex"
          style={{ justifyContent: "space-evenly", marginBottom: 10 }}
        >
          <Col md={11} span={24}>
            <Form.Item name="username" rules={rules.username}>
              <Input
                name="username"
                prefix={<UserOutlined />}
                placeholder="Username"
                onChange={(e) => handleUserUpdate(e)}
              />
            </Form.Item>
          </Col>
          <Col md={11} span={24}>
            <Form.Item name="email" rules={rules.email}>
              <Input
                prefix={<MailOutlined />}
                name="email"
                type="email"
                onChange={(e) => handleUserUpdate(e)}
                placeholder="Email"
              ></Input>
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ padding: 20, marginBottom: 10 }}>
          <Col md={11} span={24}>
            <Form.Item name="gender" label="Gender">
              <Radio.Group
                optionType="button"
                name="gender"
                onChange={(e) => handleUserUpdate(e)}
              >
                <Radio.Button value="male">Male</Radio.Button>
                <Radio.Button value="female">Female</Radio.Button>
                <Radio.Button value="other">Other</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col md={11} span={24}>
            <Form.Item name="looking" label="Interest">
              <Radio.Group
                optionType="button"
                name="looking"
                onChange={(e) => handleUserUpdate(e)}
              >
                <Radio.Button value="male">Male</Radio.Button>
                <Radio.Button value="female">Female</Radio.Button>
                <Radio.Button value="other">Other</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row
          type="flex"
          style={{ marginBottom: 10, justifyContent: "space-around" }}
        >
          <Col md={11} span={24}>
            <Form.Item>
              <DatePicker
                placeholder="Birthdate"
                name="birthday"
                format={dateFormat}
                style={{
                  width: "100%",
                  height: "38px",
                  fontSize: "1rem",
                  border: "none",
                  borderBottom: "2px solid #d9d9d9",
                  color: "black",
                }}
                onChange={(value) => {
                  handleUserDate(value);
                }}
              />
            </Form.Item>
          </Col>
          <Col md={11} span={24}>
            <Form.Item label="Tags">
              {userInfos.tags.map((tag, index) => (
                <Tag
                  className="tags"
                  key={tag}
                  style={{
                    marginBottom: "15px",
                    fontSize: "15px",
                    borderRadius: "6px",
                    color: "white",
                    padding: "5px 13px",
                    boxShadow: "0px 4px 9px rgb(42 139 242 / 20%)",
                    background:
                      "linear-gradient(3deg, #60a9f6 0%, #2a8bf2 100%)",
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
                  placeholder="Add tag"
                />
              )}
              {!inputVisible && (
                <Tag className="site-tag-plus" onClick={handleTagClick}>
                  <PlusOutlined /> New Tag
                </Tag>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="bio">
          <Input.TextArea
            rows={4}
            allowClear
            name="bio"
            showCount
            maxLength={100}
            placeholder="Description"
            onChange={(e) => handleUserUpdate(e)}
          />
        </Form.Item>
        <Form.Item style={{ textAlign: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            onClick={(e) => {
              form.resetFields();
              SubmitInfo();
            }}
            style={{
              fontSize: "0.6em",
              marginTop: "20px",
              borderRadius: "8px",
              padding: "4px 20px",
            }}
          >
            Edit Info
          </Button>
        </Form.Item>
      </Form>
      <Form>
        <Divider orientation="center" style={{ margin: "50px 0px" }}>
          Pictures
        </Divider>
        <Form.Item id="upload-img">
          <ImageUploading
            multiple
            name="gallery"
            value={userPictures.gallery}
            onChange={handleGalleryUpload}
            maxNumber={4}
          >
            {({ onImageUpload, imageList }) => (
              <div className="upload__image-wrapper">
                <Button
                  ref={galleryUpload}
                  style={{ display: "none" }}
                  onClick={onImageUpload}
                />

                <div className="listImage">
                  {imageList.map((image, key) => (
                    <div className="tte" key={key}>
                      <img
                        src={
                          image.url
                            ? "http://localhost:3001/api/" + image.url
                            : image.dataURL
                        }
                        alt="..."
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                        }}
                      />
                      <Popconfirm
                        title="Are you sure to delete this image?"
                        onConfirm={() => confirm(image.id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                        style={{ fontSize: "0.8em" }}
                      >
                        <div className="removeImg">
                          <DeleteOutlined
                            style={{ fontSize: "30px", color: "#fff" }}
                          />
                        </div>
                      </Popconfirm>
                    </div>
                  ))}
                  {userPictures.gallery.length < 4 ? (
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
        </Form.Item>
      </Form>
      <Form>
        <Divider orientation="center" style={{ margin: "50px 0px" }}>
          Map
        </Divider>

        <Form.Item>
          <Map
            style={{ height: "500px", width: "100wh" }}
            center={position}
            zoom={13}
            scrollWheelZoom={false}
          >
            <SearchComponent />
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                Your are here <br /> We see you.
              </Popup>
            </Marker>
          </Map>
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              fontSize: "0.6em",
              marginTop: "20px",
              borderRadius: "8px",
              padding: "4px 20px",
            }}
            onClick={submitLocation}
          >
            Edit Location
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
