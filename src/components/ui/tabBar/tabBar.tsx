import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../../asset/sass/etc/tabBar/tabBar.scss';
// import { ACCESS_TOKEN } from '../../global/constants';
import user from '../../../asset/image/tabbar-user.svg';
import home from '../../../asset/image/tabbar-home.svg';
import alert from '../../../asset/image/tabbar-alert.svg';
import newAlert from '../../../asset/image/tabbar-new-alert.svg';

import { useSelector } from 'react-redux';
interface RootState {
  user: {
    isLoggedIn: boolean;
  };
  alert: {
    count: number;
  };
}
const TabBar = () => {
  const [activeNav, setActiveNav] = useState(1);
  // const [showTabBar, setShowTabBar] = useState(true);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const isNewAlert = useSelector((state: RootState) => state.alert.count);

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setActiveNav(1);
        break;
      case '/mypage':
        setActiveNav(2);
        break;
      case '/notification':
        setActiveNav(3);
        break;
      default:
        break;
    }
  }, [location]);

  // if (!isLoggedIn) {
  //   return null;
  // }

  return (
    <nav className="wrapper">
      <div style={{ width: '33.33%' }}>
        <Link
          to={isLoggedIn ? '/mypage' : '/login'}
          className="nav-link"
          onClick={() => setActiveNav(2)}
        >
          <div className={activeNav === 2 ? 'nav-item tab-active' : 'nav-item'}>
            <img src={user} alt="user" className="icon" />
            <div className="text">마이페이지</div>
          </div>
        </Link>
      </div>

      <div
        style={{ width: '33.33%' }}
        // className={isLoggedIn ? '' : 'nav-center'}
      >
        <Link to="/" className="nav-link" onClick={() => setActiveNav(1)}>
          <div className={activeNav === 1 ? 'nav-item tab-active' : 'nav-item'}>
            <img src={home} alt="user" className="icon" />{' '}
            <div className="text">홈</div>
          </div>
        </Link>
      </div>

      <div style={{ width: '33.33%' }}>
        <Link
          to={isLoggedIn ? '/notification' : '/login'}
          className="nav-link"
          onClick={() => setActiveNav(3)}
        >
          <div className={activeNav === 3 ? 'nav-item tab-active' : 'nav-item'}>
            {isNewAlert > 0 && (
              <img src={newAlert} alt="new alert" className="icon-overlay" />
            )}
            <img src={alert} alt="user" className="icon" />
            <div className="text">알림</div>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default TabBar;
