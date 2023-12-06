import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { Modal } from "src/components/Modal";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import notify from "src/utils/toast";
import { translate } from "src/utils/translate";
import { object, string } from "yup";
import style from "./style.module.scss";

const schema = () =>
	object({
		brand_code: string().required(translate.errors.required).length(5, "حداکثر ۵ رقم"),
		title: string().required(translate.errors.required),
		shape: string().required(translate.errors.required),
		dose: string().required(translate.errors.required),
		price_exchange_subsidy: string().required(translate.errors.required),
		percent_share_of_organization_exchange_subsidy: string().required(translate.errors.required),
		term: string(),
	});

const MedicineModal = ({
	open,
	setOpen,
	reload,
	setReload,
	setDefaultValue,
	defaultValue = null,
}) => {
	const {
		register,
		setError,
		setValue,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(schema()),
	});

	const [loading, setLoading] = useState(false);
	const [editItemID, setEditItemID] = useState(null);

	const onSubmit = (data) => {
		setLoading(true);
		if (editItemID === null) {
			axios
				.post("/admin/medicine/manage/list_create/", data)
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
				.put(`/admin/medicine/manage/update_delete/?pk=${editItemID}`, data)
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
			setValue("brand_code", defaultValue?.brand_code);
			setValue("title", defaultValue?.title);
			setValue("shape", defaultValue?.shape);
			setValue("dose", defaultValue?.dose);
			setValue("price_exchange_subsidy", defaultValue?.price_exchange_subsidy);
			setValue(
				"percent_share_of_organization_exchange_subsidy",
				defaultValue?.percent_share_of_organization_exchange_subsidy,
			);
			setValue("term", defaultValue?.term);
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
					label="کد برند"
					error={errors.brand_code?.message}
					{...register("brand_code")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="نام"
					required
					error={errors.title?.message}
					{...register("title")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="شکل"
					required
					error={errors.shape?.message}
					{...register("shape")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="دوز"
					required
					error={errors.dose?.message}
					{...register("dose")}
				/>
				<Input
					className={style.form__inputFull}
					size="xlarge"
					label="شرایط تعهد"
					error={errors.term?.message}
					{...register("term")}
					type="textarea"
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="قیمت"
					required
					error={errors.price_exchange_subsidy?.message}
					{...register("price_exchange_subsidy")}
				/>
				<Input
					className={style.form__input}
					size="xlarge"
					label="درصد سهم سازمان"
					required
					error={errors.percent_share_of_organization_exchange_subsidy?.message}
					{...register("percent_share_of_organization_exchange_subsidy")}
				/>
			</form>
		</Modal>
	);
};

export default MedicineModal;
