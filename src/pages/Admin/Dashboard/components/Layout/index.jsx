import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import style from './style.module.scss';

const Layout = () => {
	const [sidebar, setSidebar] = useState(false);
	const { pathname } = useLocation();
	const isDashboard = /^\/dashboard\/?$/.test(pathname);

	return (
		<div className={`${style.wrapper} ${isDashboard ? 'dashboard' : ''}`}>
			<div className='container'>
				<Sidebar sidebar={sidebar} setSidebar={setSidebar} />
				<main className={style.main}>
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Layout;
