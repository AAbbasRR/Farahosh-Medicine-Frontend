import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "src/assets/images/mask-group.png";
import useAuthStore from "src/store";
import { Mobile } from "./components/Mobile";
import { Otp } from "./components/Otp";
import style from "./style.module.scss";

const SignIn = () => {
	const navigate = useNavigate();
	const { accessToken } = useAuthStore();

	const [mobileNumber, setMobileNumber] = useState("");
	const [tab, setTab] = useState(0);

	useEffect(() => {
		if (accessToken) {
			navigate("/dashboard");
		}
	}, [accessToken]);

	return (
		<div className={style.wrapper}>
			<div className={style.logo}>{/* <img src={logo} alt='logo' /> */}</div>

			<div className={style.main}>
				{tab !== 1 && (
					<div className={style.header}>
						<div className={style.title}>
							<img src={avatar} className={style.title__icon} alt="avatar" />
							ورود به حساب کاربری
						</div>

						<span className={style.message}>کاربر گرامی، خوش آمدید.</span>
					</div>
				)}

				{tab === 0 && (
					<Mobile mobileNumber={mobileNumber} setStep={setTab} setMobileNumber={setMobileNumber} />
				)}
				{tab === 1 && <Otp phone={mobileNumber} setStep={setTab} />}
			</div>
		</div>
	);
};

export default SignIn;
