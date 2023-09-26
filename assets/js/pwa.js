// ServiceWorker Registration
document.addEventListener("DOMContentLoaded", init, false);
function init() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          console.log("ServiceWorker unregistered.", registration);
          registration.unregister();
        }
      });

      navigator.serviceWorker.register("js/sw.js").then(
        function (registration) {
          // Registration was successful
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        },
        function (err) {
          // registration failed :(
          console.log("ServiceWorker registration failed: ", err);
        }
      );
    });
  }
}
