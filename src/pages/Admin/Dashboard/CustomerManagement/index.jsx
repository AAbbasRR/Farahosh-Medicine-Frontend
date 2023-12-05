import _debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";
import IconSearch from "src/assets/icons/icon-input-search.svg";
import IconAdd from "src/assets/icons/icon-plus-circle-success.svg";
import IconDelete from "src/assets/icons/icon-delete.svg";
import IconEdit from "src/assets/icons/icon-edit.svg";
import { Tooltip, IconButton } from "@mui/material";
import { Empty } from "src/components/Empty";
import { Input } from "src/components/Input";
import { Table } from "src/components/Table";
import { handleError } from "src/utils/api-error-handling";
import CustomerModal from "./CustomerModal";
import axios from "src/utils/axios";
import style from "./style.module.scss";

const CustomerManagement = () => {
	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [paginationModel, setPaginationModel] = useState({ pageSize: 25, page: 0 });
	const [value, setValue] = useState("");
	const [customerModalOpen, setCustomerModalOpen] = useState(false);
	const [editCustomerData, setEditCustomerData] = useState(null);
	const [reload, setReload] = useState(false);

	const debouncedSearch = useMemo(
		() =>
			_debounce((value) => {
				setSearchValue(value);
			}, 750),
		[searchValue],
	);

	const handleChange = (e) => {
		const value = e.target.value;
		setValue(value);
		debouncedSearch(value);
	};

	const getData = () => {
		setLoading(true);
		const { pageSize, page } = paginationModel;

		axios
			.get("/admin/user/manage/user/list_create/", {
				params: { search: searchValue, page: page + 1, page_size: pageSize },
			})
			.then((res) => {
				setData(res.data.results);
				setCount(res?.data?.count_all);
			})
			.catch((err) => {
				handleError({ err });
			})
			.finally(() => setLoading(false));
	};
	const deleteCustomer = (id) => {
		axios
			.delete("/admin/user/manage/user/list_create/", {
				params: { pk: id },
			})
			.then((res) => {
				getData();
			})
			.catch((err) => {
				handleError({ err });
			})
			.finally(() => setLoading(false));
	};
	const editCustomer = (item) => {
		setCustomerModalOpen(true);
		setEditCustomerData(item);
	};

	useEffect(() => {
		setPaginationModel((e) => ({ ...e, page: 0 }));
	}, [searchValue]);
	useEffect(() => {
		getData();
	}, [reload, paginationModel]);

	const columns = [
		{
			headerName: "نام",
			field: "first_name",
			flex: 1,
			sortable: false,
		},
		{
			headerName: "نام خانوادگی",
			field: "last_name",
			flex: 1,
			sortable: false,
		},
		{
			headerName: "شاره موبایل",
			field: "mobile_number",
			flex: 1,
			sortable: false,
		},
		{
			headerName: "تاریخ ایجاد",
			field: "formatted_date_joined",
			flex: 1,
			sortable: false,
			renderCell: ({ row }) => new Date(row?.formatted_date_joined).toLocaleString("fa-IR"),
		},
		{
			headerName: "تاریخ آخرین ورود",
			field: "formatted_last_login",
			flex: 1,
			sortable: false,
			renderCell: ({ row }) => {
				if (row?.formatted_last_login === null) {
					return "وارد نشده";
				}
				return new Date(row?.formatted_last_login).toLocaleString("fa-IR");
			},
		},
		{
			headerName: "",
			field: "action",
			sortable: false,
			renderCell: ({ row }) => (
				<div className={style.row}>
					<Tooltip title="ویرایش">
						<IconButton className={style.IconButton} onClick={() => editCustomer(row)}>
							<img src={IconEdit} alt="delete-icon" />
						</IconButton>
					</Tooltip>
					<Tooltip title="حذف">
						<IconButton className={style.IconButton} onClick={() => deleteCustomer(row?.id)}>
							<img src={IconDelete} alt="delete-icon" />
						</IconButton>
					</Tooltip>
				</div>
			),
		},
	];

	return (
		<>
			<div className={style.wrapper}>
				<div className={style.main}>
					<div className={`${style.history} ${"active"}`}>
						<div className={style.header}>
							<div className={style.header__title}>
								<div className={style.title}>مدیریت مشتریان</div>
								<Tooltip title="اضافه کردن مشتری">
									<IconButton
										className={style.IconButton}
										onClick={() => setCustomerModalOpen(true)}
									>
										<img src={IconAdd} alt="add-icon" />
									</IconButton>
								</Tooltip>
							</div>
							<Input
								size="small"
								value={value}
								className={style.input}
								onChange={handleChange}
								placeholder="جستجو..."
								rightIcon={<img src={IconSearch} alt="search-icon" />}
							/>
						</div>
						{data.length > 0 ? (
							<div className={style.table}>
								<Table
									rows={data}
									rowCount={count}
									loading={loading}
									columns={columns}
									paginationMode="server"
									paginationModel={paginationModel}
									onPaginationModelChange={setPaginationModel}
								/>
							</div>
						) : (
							<Empty />
						)}
					</div>
				</div>
			</div>
			<CustomerModal
				open={customerModalOpen}
				setOpen={setCustomerModalOpen}
				setDefaultValue={setEditCustomerData}
				defaultValue={editCustomerData}
				reload={reload}
				setReload={setReload}
			/>
		</>
	);
};

export default CustomerManagement;
