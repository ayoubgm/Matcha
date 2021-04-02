import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  Row,
  Col,
  Slider,
  Input,
  Tag,
  Form,
  Button,
  Collapse,
  AutoComplete,
} from "antd";
import {
  FrownOutlined,
  SmileOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import axios from "axios";

export const Search = (props) => {
  const handleTagClick = () => {
    setInputVisible(true);
  };

  // const mid = ((age.fameEnd - age.fameStart) / 2).toFixed(5);
  // const preColorCls = age.value >= mid ? "" : "icon-wrapper-active";
  // const nextColorCls = age.value >= mid ? "icon-wrapper-active" : "";

  // * AGE search
  const handlChangeAge = (e) => {
    if (e[0] >= 18 && e[1] <= 60) props.handleSearchAge(e[0], e[1]);
  };
  // * Location Search
  const handleChangeLocation = (e) => {
    props.handleSearchLocation(e.target.value);
  };

  // * FAME Search
  const handleChangeFame = (e) => {
    if (e[0] >= 0 && e[1] <= 100) props.handleSearchFame(e[0], e[1]);
  };

  // * COMMON TAGS FILTER
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

  const [tags, setTags] = useStateCallback([]);
  const [options, setOptions] = useStateCallback([]);
  const [tag, setTag] = useState("");
  const [originalTags, setOriginalTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const { Panel } = Collapse;

  //Tag Autocomplete
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

  const removeTag = (tag) => {
    // eslint-disable-next-line
    let tagsd = tags.filter((t) => {
      if (t !== tag) return t;
    });
    setTags(tagsd, (data) => props.handleSearchTags(data));
  };

  const onSelect = (data) => {
    // eslint-disable-next-line
    if (props.search.tags.length <= 4) {
      // eslint-disable-next-line
      if (!tags.filter((t) => t == data).length)
        setTags([...tags, data], (data) => props.handleSearchTags(data));
      setTag("");
      setOptions(
        originalTags.map((t) => {
          return { value: t };
        })
      );
    }
  };

  return (
    <Collapse accordion style={{ borderRadius: "15px" }}>
      <Panel header="Search by :" key="0" style={{ borderRadius: "15px" }}>
        <Card style={{ width: "100%", border: "none" }}>
          <Row
            type="flex"
            style={{ justifyContent: "space-around", marginBottom: "20px" }}
          >
            <Col md={11} span={24}>
              <h4>Age:</h4>
              <Slider
                min={18}
                max={60}
                range={{ draggableTrack: true }}
                onChange={(e) => handlChangeAge(e)}
                defaultValue={[props.search.minage, props.search.maxage]}
              />
            </Col>
            <Col md={11} span={24}>
              <h4>Fame:</h4>
              <div className="icon-wrapper">
                <FrownOutlined />
                <Slider
                  min={0}
                  max={100}
                  range={{ draggableTrack: true }}
                  onChange={(e) => handleChangeFame(e)}
                  defaultValue={[props.search.minfame, props.search.maxfame]}
                />
                <SmileOutlined />
              </div>
            </Col>
          </Row>
          <Row type="flex">
            <Col span={24} style={{ marginBottom: "10px" }}>
              <h4>Location:</h4>
              <Input
                placeholder="Choose a location..."
                onChange={(e) => handleChangeLocation(e)}
              />
            </Col>
            <h4>Tags</h4>
            <Col
              span={24}
              style={{
                borderRadius: "10px",
                padding: "5px",
              }}
            >
              <Form.Item>
                {props.search.tags.map((tag) => (
                  <Tag
                    width={0.5}
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
                    closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
                    onClose={() => removeTag(tag)}
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
          <div style={{ textAlign: "center" }}>
            <Button
              type="primary"
              style={{
                marginRight: "15px",
                marginTop: "20px",
                fontSize: "0.8em",
                borderRadius: "6px",
              }}
              onClick={props.loadSearchUsers}
            >
              Search
            </Button>
            <Button
              type="primary"
              style={{
                marginTop: "20px",
                fontSize: "0.8em",
                borderRadius: "6px",
              }}
              onClick={props.clearSearch}
            >
              Clear
            </Button>
          </div>
        </Card>
      </Panel>
    </Collapse>
  );
};
