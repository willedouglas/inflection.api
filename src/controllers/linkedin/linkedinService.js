const getProfileImage = (profilePicture) => {
  const displayImage = profilePicture['displayImage~'];
  const firstElement = displayImage.elements[0];
  const identifier = firstElement.identifiers[0];
  const profileUrl = identifier.identifier;
  return profileUrl;
};

const normalizeProfile = (response) => {
  const { localizedFirstName, localizedLastName, profilePicture } = response;

  return {
    firstName: localizedFirstName,
    lastName: localizedLastName,
    profilePicture: getProfileImage(profilePicture),
  };
};

module.exports = {
  normalizeProfile,
};
