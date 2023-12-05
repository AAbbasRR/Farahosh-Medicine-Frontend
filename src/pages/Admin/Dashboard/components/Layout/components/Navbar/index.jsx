import { NavLink } from "react-router-dom";
import IconAdminManagement from "src/assets/icons/icon-admin-management.svg";
import IconCustomerManagement from "src/assets/icons/icon-customer-management.svg";
import IconMedicineManagement from "src/assets/icons/icon-medicine-management.svg";
import style from "./style.module.scss";

export const Navbar = () => {
	const claassName = ({ isActive }) => (isActive ? style.nav__link + " active" : style.nav__link);

	return (
		<div className={style.wrapper}>
			<div className={style.main}>
				<nav className={style.nav}>
					<NavLink to="admin-management" className={claassName}>
						<img className={style.nav__linkIcon} alt="shop-icon" src={IconAdminManagement} />
						<span className={style.nav__linkTitle}>کارمندان</span>
					</NavLink>
					<NavLink to="medicines-management" className={claassName}>
						<img className={style.nav__linkIcon} alt="product-icon" src={IconMedicineManagement} />
						<span className={style.nav__linkTitle}>داروها</span>
					</NavLink>
					<NavLink to="customer-management" className={claassName}>
						<img className={style.nav__linkIcon} alt="user-icon" src={IconCustomerManagement} />
						<span className={style.nav__linkTitle}>مشتریان</span>
					</NavLink>
				</nav>
			</div>
		</div>
	);
};
