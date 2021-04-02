import Layout from "../layout/default";
import "../assets/css/home.less";
import { Row, Col, Radio, message, Pagination } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { Search } from "../components/Search";
import { Filter } from "../components/Filter";
import { UserCard } from "../components/UserCard";
import { BrowsingAction, searchAction } from "../actions/browsingActions";
import { Context } from "../Contexts/Context";
import { openMessageError } from "../helper/Verifications";
import _ from "lodash";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Home = () => {
  const { state } = useContext(Context);

  const [isloading, setIsloading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  // eslint-disable-next-line
  const [limit_p, setLimit_p] = useState(12);
  const [limit, setLimit] = useState(0);
  const [page, setPage] = useState(1);
  const [countPage, setCountpage] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const [search, setSearch] = useState({
    minage: 18,
    maxage: 60,
    minfame: 0,
    maxfame: 100,
    location: "",
    tags: [],
  });
  const [filter, setFilter] = useState({
    minage: 18,
    maxage: 60,
    minfame: 0,
    maxfame: 100,
    mind: 0,
    maxd: 1000,
    tags: [],
  });

  const setInitialData = async () => {
    await setLimit(page * limit_p);
  };

  const loadUsers = async () => {
    const res = await BrowsingAction(state.token, filter);
    let matchedUsers = [];
    let pages;

    if (res.success) {
      // ! FILTER matched users
      matchedUsers = res.users;
      // * => Tags Filter
      if (filter.tags.length !== 0) {
        matchedUsers = _.filter(matchedUsers, {
          tags: filter.tags.map((t) => {
            return { name: t.substring(1) };
          }),
        });
      }
      //* Set suggestions list
      setUsers(matchedUsers);
      pages = Math.round(matchedUsers.length / limit_p);
      setCountpage(pages ? pages : 1);
      setIsloading(false);
    } else {
      message.loading("Loading...", 2);
      openMessageError(res.error);
    }
  };

  const handlePagination = (p) => {
    setPage(p);
    setLimit(limit_p * p);
  };

  const handleFilterAge = (min, max) => {
    setFilter({ ...filter, minage: min, maxage: max });
  };

  const handleFilterDistance = (mind, maxd) => {
    setFilter({ ...filter, mind: mind, maxd: maxd });
  };

  const handleFilterFame = (minfame, maxfame) => {
    setFilter({ ...filter, minfame: minfame, maxfame: maxfame });
  };

  const handleFilterTags = (tag) => {
    setFilter({ ...filter, tags: tag });
  };

  //* SORT
  const sort = (field) => {
    // eslint-disable-next-line
    const choice = field.toLowerCase();
    // eslint-disable-next-line
    switch (choice) {
      case "age":
        isSearching
          ? setSearchedUsers(_.sortBy(searchedUsers, [choice]))
          : setUsers(_.sortBy(users, [choice]));
        break;
      case "distance":
        isSearching
          ? setSearchedUsers(_.sortBy(searchedUsers, [choice]))
          : setUsers(_.sortBy(users, [choice]));
        break;
      case "fame":
        isSearching
          ? setSearchedUsers(_.orderBy(searchedUsers, [choice], ["desc"]))
          : setUsers(_.orderBy(users, [choice], ["desc"]));
        break;
      case "tags":
        isSearching
          ? setSearchedUsers(_.orderBy(searchedUsers, ["commonTags"], ["desc"]))
          : setUsers(_.orderBy(users, ["commonTags"], ["desc"]));
        break;
    }
  };

  // ! HANDELE SEARCH FIELDS
  // *  Search By Age
  const handleSearchAge = (min, max) => {
    setSearch({ ...search, minage: min, maxage: max });
  };

  // * Search By fame
  const handleSearchFame = (minfame, maxfame) => {
    setSearch({ ...search, minfame: minfame, maxfame: maxfame });
  };
  // * Search By
  const handleSearchLocation = (location) => {
    setSearch({ ...search, location: location });
  };

  const handleSearchTags = (tag) => {
    setSearch({ ...search, tags: tag });
  };
  //! Load SEARCH users
  const loadSearchUsers = async () => {
    setIsSearching(true);
    const res = await searchAction(state.token, search, {});
    let searchedBylocation = [],
      searchResult = [];
    let pages;

    if (res.success) {
      // ! SEARCH
      searchResult = res.users;
      //* => Location Search Use Lodash
      if (search.location) {
        // eslint-disable-next-line
        searchedBylocation = searchResult.filter((item) => {
          if (
            _.startsWith(
              item.country.toLowerCase(),
              search.location.trim().toLowerCase()
            ) ||
            _.startsWith(
              item.city.toLowerCase(),
              search.location.trim().toLowerCase()
            )
          )
            return item;
        });
        searchResult = searchedBylocation;
      }
      // * => Tags Search
      if (search.tags.length !== 0) {
        searchResult = _.filter(searchResult, {
          tags: search.tags.map((t) => {
            return { name: t.substring(1) };
          }),
        });
      }
      // ! FILTER Search data
      // * => Age, fame or distance Filter
      // eslint-disable-next-line
      searchResult = searchResult.filter((item) => {
        if (
          (item.age >= filter.minage && item.age <= filter.maxage) ||
          (item.fame >= filter.minfame && item.fame <= filter.maxfame) ||
          (item.distance >= filter.mind && item.distance <= filter.maxd)
        )
          return item;
      });
      // * => Tags Filter
      if (filter.tags.length !== 0) {
        searchResult = _.filter(searchResult, {
          tags: filter.tags.map((t) => {
            return { name: t.substring(1) };
          }),
        });
      }
      setSearchedUsers(searchResult);
      //* => Set count pages
      pages = Math.round(searchResult.length / limit_p);
      setCountpage(pages ? pages : 1);
      setIsloading(false);
    } else {
      message.loading("Loading...", 2);
      openMessageError(res.error);
    }
  };

  const clearSearch = async () => {
    await setIsSearching(false);
    await setSearchedUsers([]);
    await loadUsers();
  };

  useEffect(() => {
    const setData = async () => {
      await setInitialData();
      setTimeout(async () => {
        await loadUsers();
      }, 3000);
    };
    setData();
    // eslint-disable-next-line
  }, []);

  return isloading ? (
    <Layout>
      <Row
        gutter={[16, 16]}
        style={{
          background: "white",
          padding: "10px 10px 10px 35px",
          borderRadius: "15px",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          marginLeft: "15px",
          marginRight: "15px",
        }}
      >
        <Loader
          type="Hearts"
          color="#f58080"
          height={200}
          width={200}
          timeout={3000}
        />
      </Row>
    </Layout>
  ) : (
    <Layout>
      <Row type="flex" style={{ justifyContent: "space-around" }}>
        <Col span={11} xs={22} md={11} style={{ marginBottom: "20px" }}>
          <Search
            search={search}
            handleSearchAge={handleSearchAge}
            handleSearchLocation={handleSearchLocation}
            handleSearchFame={handleSearchFame}
            handleSearchTags={handleSearchTags}
            loadSearchUsers={loadSearchUsers}
            clearSearch={clearSearch}
          />
        </Col>
        <Col span={11} xs={22} md={11} style={{ marginBottom: "20px" }}>
          <Filter
            filter={filter}
            statusSearch={isSearching}
            handleFilterAge={handleFilterAge}
            handleFilterDistance={handleFilterDistance}
            handleFilterFame={handleFilterFame}
            handleFilterTags={handleFilterTags}
            loadUsers={loadUsers}
            loadSearchUsers={loadSearchUsers}
          />
        </Col>
      </Row>
      <Row
        gutter={[16, 16]}
        style={{
          background: "white",
          padding: "10px 10px 10px 35px",
          borderRadius: "15px",
          marginLeft: "15px",
          marginRight: "15px",
        }}
      >
        <Col span={24}>
          <div style={{ float: "right" }}>
            <h4 style={{ display: "inline-block", marginRight: "20px" }}>
              Sort by:
            </h4>
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              onChange={(e) => {
                sort(e.target.value);
              }}
            >
              <Radio.Button value="age">Age</Radio.Button>
              <Radio.Button value="distance">Distance</Radio.Button>
              <Radio.Button value="fame">Fame</Radio.Button>
              <Radio.Button value="tags">Common tags</Radio.Button>
            </Radio.Group>
          </div>
        </Col>
        {isSearching
          ? searchedUsers.slice(limit - limit_p, limit).map((user) => (
              <Col key={user.id} xxl={4} xs={24} sm={12} lg={6} span={6}>
                <UserCard data={user} />
              </Col>
            ))
          : users.slice(limit - limit_p, limit).map((user) => (
              <Col key={user.id} xxl={4} xs={24} sm={12} lg={6} span={6}>
                <UserCard data={user} />
              </Col>
            ))}
      </Row>
      <Row
        type="flex"
        style={{ justifyContent: "space-around", margin: "20px" }}
      >
        <Pagination
          hideOnSinglePage
          defaultCurrent={page}
          showSizeChanger={false}
          total={countPage * 10}
          onChange={(page) => {
            handlePagination(page);
          }}
        />
      </Row>
    </Layout>
  );
};

export default Home;
