const dateDisplayFormatter = new Intl.DateTimeFormat("id-ID", {
	dateStyle: "medium",
	timeStyle: "short",
	timeZone: "Asia/Jakarta",
});

const formatDateForDisplay = (date: Date): string => {
	return dateDisplayFormatter.format(date);
};

export { formatDateForDisplay };
