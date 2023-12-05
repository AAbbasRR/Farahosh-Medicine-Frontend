import { Autocomplete, Divider, Popper, TextField, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import iconRemove from "src/assets/icons/icon-remove.svg";
import { Input } from "src/components/Input";
import { handleError } from "src/utils/api-error-handling";
import axios from "src/utils/axios";
import style from "./style.module.scss";

const styles = (theme) => ({
	popper: {
		width: "fit-content",
	},
});

const sxProps = {
	fontFamily: "inherit",
	boxShadow: "none",
	borderRadius: "0.75rem",
	border: "1px solid var(--bl-on-surface-38)",
	backgroundColor: "var(--bl-surface-container-lowest)",
	"&.MuiFilledInput-root": {
		borderColor: "transparent",
		color: "var(--bl-on-surface)",
		backgroundColor: "var(--bl-surface-container-low)",
	},
	"& .MuiInputBase-input": {
		position: "relative",
		fontSize: "0.75rem",
		height: "1rem",
		lineHeight: "1rem",
		padding: "0.25rem 0.75rem 0.25rem !important",
		minHeight: "unset",
		"&:focus": {
			boxShadow: "none",
			backgroundColor: "transparent",
		},
	},
};

export const MedicineItem = () => {
	const inputRefCode = useRef();
	const inputRefName = useRef();
	const inputRefNumber = useRef();

	const [loading, setLoading] = useState(false);
	const [medicineData, setMedicineData] = useState([]);
	const [medicineNameOptions, setMedicineNameOptions] = useState([]);
	const [medicineCodeOptions, setMedicineCodeOptions] = useState([]);
	const [calculatedMedicine, setCalculatedMedicine] = useState([]);
	const [tabIndexCount, setTabIndexCount] = useState(-1);

	useEffect(() => {
		const handleTab = (event) => {
			if (event.keyCode === 9) {
				event.preventDefault();
				let counter = Number(
					document.getElementById("hidden_tabindex_counter").getAttribute("count"),
				);
				let tabIndex = counter + 1;
				if (tabIndex === 0) {
					inputRefCode.current.focus();
				} else if (tabIndex === 1) {
					inputRefName.current.focus();
				} else if (tabIndex === 2) {
					tabIndex = -1;
					inputRefNumber.current.focus();
				}
				setTabIndexCount(tabIndex);
			}
		};
		document.addEventListener("keydown", handleTab);

		return () => {
			document.removeEventListener("keydown", handleTab);
		};
	}, []);
	useEffect(() => {
		document.getElementById("hidden_tabindex_counter").setAttribute("count", tabIndexCount);
	}, [tabIndexCount]);
	useEffect(() => {
		setLoading(true);
		axios
			.get("user/medicine/list/all/")
			.then((res) => {
				setMedicineData(res.data);
				const nameOptions = [];
				res.data.map((item) => {
					nameOptions.push({
						label: `${item.title} - ${item.shape} - ${item.dose}`,
						value: item.id,
					});
				});
				setMedicineNameOptions(nameOptions);
				const codeOptions = [];
				res.data.map((item) => {
					codeOptions.push({
						label: item.brand_code,
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

	const addNewMedicineItem = (event, newValue) => {
		const medicine = medicineData.find((item) => item.id === newValue.value);
		const medicineInItem = calculatedMedicine.find((item) => item.id === newValue.value);
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
			<div id="hidden_tabindex_counter" stype={{ display: "none" }} count="0" />
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
								{console.log(calculatedMedicine.length - 1 === index)}
								<TextField
									type="number"
									size="xsmall"
									value={item.count}
									inputRef={calculatedMedicine.length - 1 === index && inputRefNumber}
									onChange={(e) => changeCountMedicineItem(e, item)}
									sx={sxProps}
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
							<Autocomplete
								disablePortal
								id="medicine_code"
								size="small"
								fullWidth
								options={medicineCodeOptions}
								renderInput={(params) => (
									<TextField size="small" inputRef={inputRefCode} {...params} sx={sxProps} />
								)}
								onChange={addNewMedicineItem}
								value={null}
							/>
						</span>
						<span>
							<Autocomplete
								disablePortal
								fullWidth
								PopperComponent={(props) => (
									<Popper {...props} style={styles.popper} placement="bottom-start" />
								)}
								id="medicine_name"
								size="small"
								options={medicineNameOptions}
								renderInput={(params) => (
									<TextField size="small" {...params} inputRef={inputRefName} sx={sxProps} />
								)}
								onChange={addNewMedicineItem}
								value={null}
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
