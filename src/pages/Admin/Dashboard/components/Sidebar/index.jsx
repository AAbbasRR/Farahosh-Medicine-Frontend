import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import IconCalculate from "src/assets/icons/icon-calculate.svg";
import IconRemove from "src/assets/icons/icon-exit-24.svg";
import IconExit from "src/assets/icons/icon-exit.svg";
import avatar from "src/assets/images/mask-group.png";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import useAuthStore from "src/store";
import axios from "src/utils/axios";
import style from "./style.module.scss";

const links = [{ name: "داروها", path: "/dashboard/medicines", icon: IconCalculate }];

export const Sidebar = ({ sidebar, setSidebar }) => {
	const { userInfo, logout, updateUserInfo } = useAuthStore();

	const [open, setOpen] = useState(false);

	const handleLogout = () => {
		setOpen(false);
		logout();
	};

	useEffect(() => {
		axios.get("/user/auth/info/").then((res) => {
			updateUserInfo(res.data);
		});
	}, []);

	return (
		<>
			<aside className={`${style.wrapper} ${sidebar ? "active" : ""}`}>
				<img
					className={style.close}
					src={IconRemove}
					onClick={() => setSidebar(false)}
					alt="remove-icon"
				/>

				<div className={style.header}>
					<div className={style.title}>
						<img src={avatar} className={style.title__icon} alt="avatar" />
						<span className={style.title__text}>
							<b>{userInfo?.full_name !== "" ? userInfo?.full_name : "ناشناس"}</b>
							{userInfo?.mobile_number ?? userInfo?.email}
						</span>
					</div>
				</div>

				<div className={style.main}>
					<nav className={style.nav}>
						{links.map((link, i) => (
							<NavLink key={i} to={link.path} end className={style.nav__link}>
								<img className={style.nav__linkIcon} src={link.icon} alt="link-icon" />
								<span className={style.nav__linkTitle}>{link.name}</span>
							</NavLink>
						))}

						<button className={style.nav__link} onClick={() => setOpen(true)}>
							<img className={style.nav__linkIcon} src={IconExit} alt="link-icon" />
							<span className={style.nav__linkTitle}>خروج</span>
						</button>
					</nav>
				</div>
			</aside>

			<Modal
				fullWidth
				state={open}
				setState={setOpen}
				title="خروج"
				footerEnd={
					<div className={style.buttons}>
						<Button size="xlarge" variant="ghost" onClick={() => setOpen(false)}>
							انصراف
						</Button>
						<Button size="xlarge" onClick={handleLogout}>
							تایید
						</Button>
					</div>
				}
			>
				<div className={style.exit}>آیا مطمئن هستید که میخواهید خارج شوید؟</div>
			</Modal>
		</>
	);
};
