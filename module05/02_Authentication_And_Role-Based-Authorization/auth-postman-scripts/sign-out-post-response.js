// 1. Check if logout was successful (adjust status code if your API returns 204 or others)
if (pm.response.code === 200 || pm.response.code === 204) {
	// 2. Clear tokens from collection variables
	pm.collectionVariables.unset("ACCESS_TOKEN");
	pm.collectionVariables.unset("REFRESH_TOKEN");

	// 3. Clear the cookie from Postman's cookie jar for this domain
	const cookieJar = pm.cookies.jar();
	const url = pm.request.url.toString();

	cookieJar.clear(url, function (error) {
		if (error) {
			console.error("Error clearing cookies:", error);
		} else {
			console.log("Cookie jar cleared for domain.");
		}
	});

	console.log("Logout successful: Local tokens and cookies cleared.");
} else {
	console.warn("Logout failed on server; local tokens were not cleared.");
}

// 4. Basic Test
pm.test("Status code is success and variables are cleared", function () {
	pm.expect(pm.response.code).to.be.oneOf([200, 204]);
	pm.expect(pm.collectionVariables.get("ACCESS_TOKEN")).to.be.undefined;
});
