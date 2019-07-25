import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import ProfileItem from "./ProfileItem";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getProfiles } from "../../actions/profile";
import axios from "axios";
const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getProfiles(currentPage, postPerPage);
    // eslint-disable-next-line
  }, [getProfiles]);
  const [totalprofiles, settotalprofiles] = useState();
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get("/api/profile/details");
      settotalprofiles(res.data.totalcount);
    };

    fetchPosts();
  }, []);
  const pageNumbers = [];
  const [currentPage] = useState(1);
  const [postPerPage] = useState(10);
  const lastpage = Math.ceil(totalprofiles / postPerPage);
  for (let i = 1; i <= Math.ceil(totalprofiles / postPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='text-primary'>Developers</h1>
          <p>
            <i className='fab fa-connectdevelop' />
            Browse and Connect with Developers
          </p>
          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map(profile => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No Profiles Found</h4>
            )}

            <ul className='pagination'>
              <li>
                <Link
                  to='#'
                  onClick={() => getProfiles(1, postPerPage)}
                  className='page-link'
                >
                  First
                </Link>
              </li>

              {pageNumbers.map(number => (
                <li key={number}>
                  <Link
                    to='#'
                    onClick={() => getProfiles(number, postPerPage)}
                    className='page-link'
                  >
                    {number}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to='#'
                  onClick={() => getProfiles(lastpage, postPerPage)}
                  className='page-link'
                >
                  Last
                </Link>
              </li>
            </ul>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  profile: state.profile,
});
export default connect(
  mapStateToProps,
  { getProfiles },
)(Profiles);
