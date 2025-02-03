import { assets } from "../admin_assets/assets";

const Header = () => {
  return (
    <header className="header">
      <div className="header__user-image">
        <img src={assets.user_avatar} alt="user avatar" />
      </div>
    </header>
  );
};

export default Header;
