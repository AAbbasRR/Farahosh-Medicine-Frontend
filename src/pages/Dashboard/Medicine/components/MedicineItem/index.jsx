import { Divider, Tooltip } from "@mui/material";
import { Select } from "src/components/Select";
import { handleError } from "src/utils/api-error-handling";
import iconRemove from "src/assets/icons/icon-remove.svg";
import axios from "src/utils/axios";
import style from "./style.module.scss";
import { Input } from "src/components/Input";

import { useEffect, useState } from "react";

export const MedicineItem = () => {
	const [loading, setLoading] = useState(false);
	const [medicineData, setMedicineData] = useState([]);
	const [medicineNameOptions, setMedicineNameOptions] = useState([]);
	const [medicineCodeOptions, setMedicineCodeOptions] = useState([]);
	const [calculatedMedicine, setCalculatedMedicine] = useState([]);

	useEffect(() => {
		setLoading(true);
		axios
			.get("user/medicine/list/all/")
			.then((res) => {
				setMedicineData(res.data);
				const nameOptions = [];
				res.data.map((item) => {
					nameOptions.push({
						name: `${item.title} - ${item.shape} - ${item.dose}`,
						value: item.id,
					});
				});
				setMedicineNameOptions(nameOptions);
				const codeOptions = [];
				res.data.map((item) => {
					codeOptions.push({
						name: item.brand_code,
						value: item.id,
					});
				});
				setMedicineCodeOptions(codeOptions);
			})
			.catch((err) => {
				handleError(err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const addNewMedicineItem = (event) => {
		const medicine = medicineData.find((item) => item.id === event.target.value);
		const medicineInItem = calculatedMedicine.find((item) => item.id === event.target.value);
		if (medicine !== medicineInItem) {
			const calculatedMedicineVar = [...calculatedMedicine];
			medicine.count = 1;
			calculatedMedicineVar.push(medicine);
			setCalculatedMedicine([...calculatedMedicineVar]);
		}
	};
	const removeMedicineItem = (item) => {
		const calculatedMedicineVar = [...calculatedMedicine];
		const medicineIndex = calculatedMedicineVar.findIndex((node) => node.id === item.id);
		if (medicineIndex > -1) {
			calculatedMedicineVar.splice(medicineIndex, 1);
			setCalculatedMedicine([...calculatedMedicineVar]);
		}
	};
	const changeCountMedicineItem = (event, item) => {
		const calculatedMedicineVar = [...calculatedMedicine];
		const medicineIndex = calculatedMedicineVar.findIndex((node) => node.id === item.id);
		calculatedMedicineVar[medicineIndex].count = event.target.value;
		setCalculatedMedicine([...calculatedMedicineVar]);
	};

	return (
		<div className={style.wrapper}>
			<div className={style.info}>
				<div className={style.info__headrow}>
					<div className={style.info__start}>
						<span>کد دارو</span>
						<span>نام دارو</span>
						<span className={style.miniSize}>تعداد</span>
						<span>قیمت واحد</span>
						<span>جمع قیمت</span>
						<span>سهم سازمان</span>
						<span>سهم بیمار</span>
					</div>
				</div>
				<Divider className={style.divider} />
				{calculatedMedicine.map((item, index) => (
					<div key={index} className={style.info__row}>
						<Tooltip title="پاک کردن">
							<img
								onClick={() => {
									removeMedicineItem(item);
								}}
								className={style.removeIcon}
								src={iconRemove}
								alt="icon-remove"
							/>
						</Tooltip>
						<div className={style.info__start}>
							<span>{item.brand_code}</span>
							<span>
								{item.title} - {item.shape} - {item.dose}
							</span>
							<span className={style.miniSize}>
								<Input
									type="number"
									size="xsmall"
									value={item.count}
									tabindex={`${calculatedMedicine.length + 2 - index}`}
									onChange={(e) => changeCountMedicineItem(e, item)}
								/>
							</span>
							<span>{(item?.price_exchange_subsidy).toLocaleString()}</span>
							<span>{(item.count * item?.price_exchange_subsidy).toLocaleString()}</span>
							<span>{(item.count * item?.price_of_percent_organization).toLocaleString()}</span>
							<span>
								{(
									item.count * item?.price_exchange_subsidy -
									item.count * item?.price_of_percent_organization
								).toLocaleString()}
							</span>
						</div>
					</div>
				))}
				<div className={style.info__row}>
					<div className={style.info__start}>
						<span>
							<Select
								size="medium"
								options={medicineCodeOptions}
								name="medicine_code"
								onChange={addNewMedicineItem}
								tabindex="1"
							/>
						</span>
						<span>
							<Select
								size="medium"
								options={medicineNameOptions}
								name="medicine_name"
								onChange={addNewMedicineItem}
								tabindex="2"
							/>
						</span>
						<span className={style.miniSize}>0</span>
						<span>0</span>
						<span>0</span>
						<span>0</span>
						<span>0</span>
					</div>
				</div>
				<Divider className={style.divider} />
				<div className={style.info__headrow}>
					<div className={style.info__start}>
						<span>
							جمع مبلغ کل:
							<br />
							{calculatedMedicine
								?.reduce((sum, item) => {
									return sum + item?.count * item?.price_exchange_subsidy;
								}, 0)
								.toLocaleString()}
						</span>
						<Divider orientation="vertical" flexItem />
						<span>
							جمع سهم سازمان:
							<br />
							{calculatedMedicine
								?.reduce((sum, item) => {
									return sum + item?.count * item?.price_of_percent_organization;
								}, 0)
								.toLocaleString()}
						</span>
						<Divider orientation="vertical" flexItem />
						<span>
							جمع سهم بیمار:
							<br />
							{calculatedMedicine
								?.reduce((sum, item) => {
									return (
										sum +
										(item.count * item?.price_exchange_subsidy -
											item.count * item?.price_of_percent_organization)
									);
								}, 0)
								.toLocaleString()}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
