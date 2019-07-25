import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
const ProfileEducation = ({
  education: {
    schoolname,
    fieldofstudy,
    location,
    current,
    to,
    from,
    description,
  },
}) => {
  return (
    <div>
      <h3 className='text-dark'>{schoolname}</h3>
      <p>
        <Moment format='YYYY/MM/DD'>{from}</Moment> -{" "}
        {!to ? "Now" : <Moment format='YYYY/MM/DD'>{to}</Moment>}
      </p>
      <p>
        <strong>Degree:</strong>
        {fieldofstudy}
      </p>
      <p>
        <strong>Location: </strong> {location}
      </p>
      <p>
        <strong>Description:</strong>
        {description}
      </p>
    </div>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired,
};

export default ProfileEducation;
