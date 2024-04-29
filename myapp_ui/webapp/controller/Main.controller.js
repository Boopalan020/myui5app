sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/my/uiapp/myappui/model/API_Servant",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, API_Servant, JSONModel) {
        "use strict";

        return Controller.extend("com.my.uiapp.myappui.controller.Main", {
            onInit: function () {
                console.log("initialising necessary things in the onInit() Method");
                this.oAdminModel = this.getOwnerComponent().getModel(); 
                this.oCustomerModel = this.getOwnerComponent().getModel("CustomerModel");   
                this._userLogin();
            },

            _userLogin : async function() {
                try {
                    // Getting logged IN User data
                    const e = this._getBaseURL() + "/user-api/currentUser";
                    this.UserData = await API_Servant._FetchUserID(e);
                    console.log("Current user ID", this.UserData);

                    this.fEnable_UI_Controller();
                } catch ( err) {
                    console.log("User Login Error : ", err);
                }
            },

            fEnable_UI_Controller : function () {
                // When the user has the Admin Role assigned in the front end, Admin specific controllers will be enabled
                if(this.UserData.scopes.includes("xsmyui5app!t265031.Admin")) {
                    this.byId("_IDGenButton1").setEnabled(true);
                }

                // When the user has the customer Role assigned in the front end, Customer specific controllers will be enabled
                if(this.UserData.scopes.includes("xsmyui5app!t265031.Customer")) {
                    this.byId("_IDGenButton2").setEnabled(true);
                }
            },

            on_GetData_Admin : async function () {
                console.log("Admin Function is triggered");
                try {
                    let AdminResult = await API_Servant._ReadData(this.oAdminModel, "/ToDoLists", []);
                    console.log("Admin Data :",AdminResult);

                    this.fSetJsonDataView(AdminResult.results);
                } catch (err) {
                    console.log("Catched Error in the API Servants call");
                }
            },

            on_GetData_Customer : async function () {
                console.log("Customer Function is triggered");
                try {
                    let CustomerResult = await API_Servant._ReadData(this.oCustomerModel, "/ToDoLists_Cust", []);
                    console.log("Customer Data :",CustomerResult);

                    this.fSetJsonDataView(CustomerResult.results);
                } catch (err) {
                    console.log("Catched Error in the API Servants call");
                }
            },

            fSetJsonDataView : function(j_data) {
                console.log("Setting the JSON Data to the View");

                // Enabling the CodeEditor
                this.byId("_IDGenPanel2").setVisible(true);

                let contextStringify = JSON.stringify(j_data, null, "\t");
                this.byId("_IDGenCodeEditor1").setValue(contextStringify);
            },

            /***************************************************************************
            * URL Generators
            ***************************************************************************/
            // Returns the Application ID
            _getApplicationID: function () {
                return this.getOwnerComponent().getManifestEntry("/sap.app").id.replaceAll(".", "");
            },

            // Returns the Application Version
            _getApplicationVersion: function () {
                return this.getOwnerComponent().getManifestEntry("/sap.app").applicationVersion.version;
            },

            // Returns the Applucation Router
            _getApplicationRouter: function () {
                return "/" + this.getOwnerComponent().getManifestEntry("/sap.cloud").service;
            },

            // Returns the complete URL of the Application
            _getCompleteURL: function () {
                return this._getApplicationRouter() + "." + this._getApplicationID() + "-" + this._getApplicationVersion();
            },

            _getBaseURL: function () {
                return sap.ui.require.toUrl("com/my/uiapp/myappui");
            },
        });
    });
