import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "src/assets/images/mask-group.png";
import useAuthStore from "src/store";
import { Username } from "./components/Username";
import style from "./style.module.scss";

const AdminSignIn = () => {
	const navigate = useNavigate();
	const { accessToken } = useAuthStore();

	useEffect(() => {
		if (accessToken) {
			navigate("/admin/dashboard");
		}
	}, [accessToken]);

	return (
		<div className={style.wrapper}>
			<div className={style.logo}>{/* <img src={logo} alt='logo' /> */}</div>

			<div className={style.main}>
				<div className={style.header}>
					<div className={style.title}>
						<img src={avatar} className={style.title__icon} alt="avatar" />
						ورود به حساب مدیریت
					</div>

					<span className={style.message}>مدیر گرامی، خوش آمدید.</span>
				</div>

				<Username />
			</div>
		</div>
	);
};

export default AdminSignIn;
