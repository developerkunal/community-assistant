import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
const Dashboardactions = ({
  profile: {
    user: { _id },
  },
}) => {
  return (
    <div className='dash-buttons'>
      <Link to={`/me`} className='btn btn-light'>
        <i className='fas fa-user-circle text-primary' />
        View Profile
      </Link>
      <Link to='/change-image' className='btn btn-light'>
        <i className='fas fa-user-circle text-primary' /> Change Profile Image
      </Link>
      <Link to='/edit-profile' className='btn btn-light'>
        <i className='fas fa-user-circle text-primary' /> Edit Profile
      </Link>
      <Link to='/add-experience' className='btn btn-light'>
        <i className='fab fa-black-tie text-primary' /> Add Experience
      </Link>
      <Link to='/add-education' className='btn btn-light'>
        <i className='fas fa-graduation-cap text-primary' /> Add Education
      </Link>
    </div>
  );
};
Dashboardactions.propTypes = {
  profile: PropTypes.object.isRequired,
};
export default Dashboardactions;
