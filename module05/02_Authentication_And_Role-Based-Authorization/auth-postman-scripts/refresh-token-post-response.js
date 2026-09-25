// Post-response script for the /refresh-token route
// 1. Extract new Access Token from the response body
const responseData = pm.response.json();
const newAccessToken = responseData.data ? responseData.data.accessToken : null;

// 2. Extract new rotated Refresh Token from the Set-Cookie header
// Ensure your domain is in the "Cookies -> Domains Allowlist"
const newRefreshToken = pm.cookies.get("refresh-token");

// 3. Update Collection Variables with the new rotated values
if (newAccessToken) {
	pm.collectionVariables.set("ACCESS_TOKEN", newAccessToken);
	console.log("New accessToken rotated and saved.");
}

if (newRefreshToken) {
	pm.collectionVariables.set("REFRESH_TOKEN", newRefreshToken);
	console.log("New refreshToken rotated and saved from cookie.");
}

if (responseData.status == 403 || responseData.status == 401) {
	pm.collectionVariables.unset("ACCESS_TOKEN");
	pm.collectionVariables.unset("REFRESH_TOKEN");

	const cookieJar = pm.cookies.jar();
	const url = pm.request.url.toString();

	cookieJar.clear(url, function (error) {
		if (error) {
			console.error("Error clearing cookies:", error);
		} else {
			console.log("Cookie jar cleared for domain.");
		}
	});
}

// 4. Validation Tests
pm.test("Token Rotation Successful", function () {
	pm.response.to.have.status(200);
	pm.expect(newAccessToken).to.not.be.null;
	pm.expect(newRefreshToken).to.not.be.null;
});

// Optional: Compare with old token to ensure it actually changed
pm.test("Refresh Token has changed (Rotated)", function () {
	const oldRefreshToken = pm.collectionVariables.get("REFRESH_TOKEN");
	// This test only works if you run it AFTER the setter above,
	// or you can store the old one in a temp variable at the start.
	pm.expect(newRefreshToken).to.not.equal(oldRefreshToken);
});
