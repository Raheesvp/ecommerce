import Header from "../Shared/Header";
import InfoGrid from "../Shared/InfoGrid";

const ProfileInfoView = ({ user, onEdit }) => (
  <>
    <Header title="Personal Information" onEdit={onEdit} />
    <InfoGrid user={user} />
  </>
);


export default ProfileInfoView; 