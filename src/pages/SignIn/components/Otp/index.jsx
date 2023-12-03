import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import OtpInput from "react18-input-otp";
import IconArrow from "src/assets/icons/icon-arrows-right-black.svg";
import avatar from "src/assets/images/emoji-welcome.png";
import { Button } from "src/components/Button";
import { Spin } from "src/components/Spin";
import useAuthStore from "src/store";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import notify from "src/utils/toast";
import { translate } from "src/utils/translate";
import { object, string } from "yup";
import style from "./style.module.scss";

const COUNTDOWN_TIME = 120000;

const schema = object({
	otp_code: string().required(translate.errors.required),
});

export const Otp = ({ phone, setStep }) => {
	const navigate = useNavigate();
	const { login } = useAuthStore();
	const {
		watch,
		control,
		setError,
		formState: { errors },
	} = useForm({ mode: "onChange", resolver: yupResolver(schema) });
	const otp_code = watch("otp_code");

	const [loading, setLoading] = useState(false);
	const [counter, setCounter] = useState({ key: false, date: Date.now() + COUNTDOWN_TIME });

	const handleResend = () => {
		axios
			.post("/user/auth/login/", { mobile_number: phone })
			.then((res) => {
				setCounter((e) => ({ key: !e.key, date: Date.now() + COUNTDOWN_TIME }));
				notify(translate.notify.sendOtpSucceed, "success");
			})
			.catch((err) => {
				handleError({ err, notify, setError });
			});
	};

	const Renderer = ({ minutes, seconds, completed }) => {
		if (completed) {
			return (
				<div className={style.counter__resend}>
					<button onClick={handleResend}>ارسال مجدد کد تایید</button>
				</div>
			);
		}

		return (
			<span className={style.counter__text}>
				ارسال مجدد کد تا {minutes}:{seconds} ثانیه دیگر
			</span>
		);
	};

	const onSubmit = () => {
		setLoading(true);

		axios
			.post("/user/auth/login/verify/", {
				otp_code,
				mobile_number: phone,
			})
			.then(async (res) => {
				await login({ ...res.data });
				notify(translate.notify.entranceSuccess, "success");
				navigate("/dashboard");
			})
			.catch((err) => {
				handleError({ err, notify, setError });
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		if (otp_code?.length > 4) {
			onSubmit();
		}
	}, [otp_code]);

	return (
		<div className={style.wrapper}>
			<div className={style.topSection}>
				<img src={IconArrow} className={style.back} alt="arrow-icon" onClick={() => setStep(0)} />

				<div className={style.welcome}>
					<span className={style.avatar}>
						<img src={avatar} alt="avatar" />
					</span>
					خوش آمدید!
					<span className={style.message}>کد تایید ورود برای شماره {phone} پیامک شد.</span>
				</div>

				<div className={`${style.input} ${errors.otp_code ? "error" : ""}`}>
					<Controller
						control={control}
						name="otp_code"
						render={({ field: { onChange, value } }) => (
							<OtpInput
								value={value}
								numInputs={5}
								onChange={onChange}
								className={style.input__otp}
								containerStyle={{
									justifyContent: "space-evenly",
									alignItems: "center",
								}}
							/>
						)}
					/>
					{errors.otp_code && <div className={style.input__error}>{errors.otp_code.message}</div>}
				</div>

				<div className={style.counter}>
					<Countdown {...counter} renderer={Renderer} />
				</div>
			</div>

			<Button size="xlarge" disabled={loading} onClick={onSubmit}>
				{loading ? <Spin /> : "تایید"}
			</Button>
		</div>
	);
};
