import { yupResolver } from "@hookform/resolvers/yup";
import { phoneNumberValidator } from "@persian-tools/persian-tools";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { Spin } from "src/components/Spin";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import notify from "src/utils/toast";
import { translate } from "src/utils/translate";
import { object, string } from "yup";
import style from "./style.module.scss";

const schema = object({
	mobile_number: string()
		.test("mobile_number", translate.errors.phone, phoneNumberValidator)
		.required(translate.errors.required),
});

export const Mobile = ({ setStep, mobile_number, setMobileNumber }) => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		defaultValues: useMemo(() => {
			return mobile_number;
		}, [mobile_number]),
		resolver: yupResolver(schema),
	});
	const [loading, setLoading] = useState(false);

	const onSubmit = (data) => {
		setLoading(true);

		axios
			.post("/user/auth/login/", data)
			.then((res) => {
				setMobileNumber(data.mobile_number);
				notify(translate.notify.sendOtpSucceed, "success");
				setStep(1);
			})
			.catch((err) => {
				handleError({ err, notify, setError });
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<form className={style.wrapper} onSubmit={handleSubmit(onSubmit)}>
			<Input
				required
				size="xlarge"
				label="شماره موبایل"
				error={errors.mobile_number && errors.mobile_number.message}
				type="number"
				className={style.input}
				{...register("mobile_number")}
			/>

			<Button size="xlarge" loading={loading} disabled={loading}>
				{loading ? <Spin /> : "ورود"}
			</Button>
		</form>
	);
};
