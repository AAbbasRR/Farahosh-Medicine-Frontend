import { useNavigate } from "react-router-dom";
import IconBack from "src/assets/icons/icon-arrows-right-black.svg";
import IconCalculate from "src/assets/icons/icon-calculate.svg";
import { MedicineItem } from "./components/MedicineItem";
import style from "./style.module.scss";

const Medicine = () => {
	const navigate = useNavigate();

	return (
		<>
			<div className={style.wrapper}>
				<img
					className={style.back}
					src={IconBack}
					onClick={() => navigate("../")}
					alt="back-icon"
				/>
				<div className={style.header}>دارو ها</div>
				<div className={style.main}>
					<div className={style.section}>
						<div className={style.heading}>
							<span className={style.heading__title}>
								<img src={IconCalculate} alt="user-icon" />
								ماشین حساب دارو
							</span>
						</div>

						<div className={style.information}>
							<MedicineItem />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Medicine;
