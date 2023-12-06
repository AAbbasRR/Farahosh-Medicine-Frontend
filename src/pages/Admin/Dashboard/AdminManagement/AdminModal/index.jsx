import { yupResolver } from "@hookform/resolvers/yup";
import { FormControlLabel } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import IconEyeClose from "src/assets/icons/icon-eye-close.svg";
import IconEyeOpen from "src/assets/icons/icon-eye-open.svg";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { Modal } from "src/components/Modal";
import { Switch } from "src/components/Switch";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import notify from "src/utils/toast";
import { translate } from "src/utils/translate";
import { bool, object, string } from "yup";
import style from "./style.module.scss";

const schema = (isUpdate) =>
	object({
		first_name: string().required(translate.errors.required),
		last_name: string().required(translate.errors.required),
		mobile_number: string().required(translate.errors.required),
		username: string(),
		password: isUpdate ? string() : string().required(translate.errors.required),
		is_staff: bool(false),
		is_superuser: bool(false),
	});

const AdminModal = ({ open, setOpen, reload, setReload, setDefaultValue, defaultValue = null }) => {
	const {
		register,
		setError,
		setValue,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(schema(defaultValue !== null)),
	});

	const [loading, setLoading] = useState(false);
	const [editItemID, setEditItemID] = useState(null);
	const [showPassword, setShowPassword] = useState(false);

	const onSubmit = (data) => {
		setLoading(true);
		if (editItemID === null) {
			axios
				.post("/admin/user/manage/admin/list_create/", data)
				.then((res) => {
					closeModal();
					notify("با موفقیت ثبت شد", "success");
					setReload(!reload);
				})
				.catch((err) => {
					handleError({ err, setError });
				})
				.finally(() => setLoading(false));
		} else {
			axios
				.put(`/admin/user/manage/admin/update_delete/?pk=${editItemID}`, data)
				.then((res) => {
					closeModal();
					notify("با موفقیت ویرایش شد", "success");
					setReload(!reload);
				})
				.catch((err) => {
					handleError({ err, setError });
				})
				.finally(() => setLoading(false));
		}
	};
	const closeModal = () => {
		setOpen(false);
		reset();
		setDefaultValue(null);
	};

	useEffect(() => {
		if (defaultValue !== null) {
			setEditItemID(defaultValue?.id);
			setValue("first_name", defaultValue?.first_name);
			setValue("last_name", defaultValue?.last_name);
			setValue("mobile_number", defaultValue?.mobile_number);
			setValue("username", defaultValue?.username);
			setValue("is_staff", defaultValue?.is_staff);
			setValue("is_superuser", defaultValue?.is_superuser);
		}
	}, [defaultValue]);

	return (
		<Modal
			fullWidth
			state={open}
			setState={closeModal}
			maxWidth="md"
			footerEnd={
				<div className={style.buttons}>
					<Button size="xlarge" variant="ghost" onClick={closeModal}>
						انصراف
					</Button>
					<Button size="xlarge" onClick={handleSubmit(onSubmit)} loading={loading}>
						تایید
					</Button>
				</div>
			}
		>
			<form className={style.form}>
				<Input
					className={style.form__input}
					required
					size="xlarge"
					label="نام"
					error={errors.first_name?.message}
					{...register("first_name")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="نام خانوادگی"
					required
					error={errors.last_name?.message}
					{...register("last_name")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="شماره موبایل"
					required
					error={errors.mobile_number?.message}
					{...register("mobile_number")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="نام کاربری"
					required
					error={errors.username?.message}
					{...register("username")}
				/>
				<Input
					required={defaultValue === null}
					size="xlarge"
					label="رمز عبور"
					error={errors.password?.message}
					type={showPassword ? "text" : "password"}
					className={style.form__input}
					leftIcon={
						<IconButton onClick={() => setShowPassword((show) => !show)}>
							<img src={showPassword ? IconEyeClose : IconEyeOpen} alt="eye-icon" />
						</IconButton>
					}
					{...register("password")}
				/>
				<div className={style.row}>
					<FormControlLabel
						className={style.formLabel}
						label="کارمند"
						control={
							<Switch
								name="is_staff"
								checked={watch("is_staff")}
								onChange={(e) => setValue("is_staff", e.target.checked)}
							/>
						}
					/>
					<FormControlLabel
						className={style.formLabel}
						label="مدیر"
						control={
							<Switch
								name="is_superuser"
								label="کارمند"
								checked={watch("is_superuser")}
								onChange={(e) => setValue("is_superuser", e.target.checked)}
							/>
						}
					/>
				</div>
			</form>
		</Modal>
	);
};

export default AdminModal;
