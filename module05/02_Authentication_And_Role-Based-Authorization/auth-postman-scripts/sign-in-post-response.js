// 1. Get Access Token from response data
const responseData = pm.response.json();
const accessToken = responseData.data ? responseData.data.accessToken : null;

// 2. Get Refresh Token from cookies
// Replace 'refreshToken' with the exact name of your cookie
const refreshToken = pm.cookies.get("refresh-token");

// 3. Assign to Collection Variables
if (accessToken) {
	pm.collectionVariables.set("ACCESS_TOKEN", accessToken);
	console.log("accessToken saved.");
}

if (refreshToken) {
	pm.collectionVariables.set("REFRESH_TOKEN", refreshToken);
	console.log("refreshToken saved from cookie.");
} else {
	console.warn(
		"refreshToken cookie not found. Check if the domain is in the Allowlist.",
	);
}

// Optional: Status check
pm.test("Tokens captured successfully", function () {
	pm.expect(accessToken).to.not.be.null;
	pm.expect(refreshToken).to.not.be.null;
});
