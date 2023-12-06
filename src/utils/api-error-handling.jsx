import notify from "./toast";

export const handleError = ({ err, setError = null }) => {
	const response = err?.response?.data ?? {};

	if (Object.hasOwn(response, "detail")) {
		notify(response.detail, "error");
	} else {
		if (setError) {
			for (let key in response) {
				setError(key, {
					type: "custom",
					message: response[key][0],
				});
			}
		}
	}
};
