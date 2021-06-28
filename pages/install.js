import React from "react";
import { Page, SettingToggle, TextStyle, Layout } from "@shopify/polaris";
import useAxios from "../hooks/useAxios";

const initialState = {
  isInstall: false,
  isLoading: false,
  isError: "",
  script: "https://facebook.com",
  event: "onload",
  installedScript: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INSTALL_SUCCESS":
      return {
        ...state,
        isInstall: true,
        isLoading: false,
        isError: "",
        installedScript: action.payload,
      };
    case "INSTALL_FAIL":
      return {
        ...state,
        isInstall: false,
        isLoading: false,
        isError: action.payload,
      };
    case "INSTALL_LOADING":
      return {
        ...state,
        isLoading: true,
        isError: "",
      };
    case "UNINSTALL_SUCCESS":
      return {
        ...state,
        isInstall: false,
        isLoading: false,
        isError: "",
        installedScript: null,
      };
    case "UNINSTALL_FAIL":
      return {
        ...state,
        isInstall: true,
        isLoading: false,
        isError: action.payload,
      };
    default:
      return state;
  }
};
const installLoading = () => ({ type: "INSTALL_LOADING" });
const installSuccess = (script) => ({
  type: "INSTALL_SUCCESS",
  payload: script,
});
const installFail = (error) => ({ type: "INSTALL_FAIL", payload: error });
const uninstallSuccess = () => ({ type: "UNINSTALL_SUCCESS" });
const uninstallFail = (error) => ({ type: "UNINSTALL_FAIL", payload: error });

function install(props) {
  const [axios] = useAxios();
  const [bannerScript, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch(installLoading());
    axios
      .get(`https://qbfy.herokuapp.com/script_tags`)
      .then((res) => {
        if (res.data.script_tags.length > 0) {
          dispatch(installSuccess(res.data.script_tags[0]));
        } else {
          dispatch(uninstallSuccess());
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  const handleInstall = async () => {
    dispatch(installLoading());
    if (!bannerScript.isInstall) {
      try {
        const result = await axios.post(`https://qbfy.herokuapp.com/script_tags`);
        if (result.status === 200) {
          dispatch(installSuccess(result.data.script_tag));
        } else {
          dispatch(installFail(result.data.error));
        }
      } catch (error) {
        dispatch(installFail(error.message));
      }
    } else {
      try {
        const result = await axios.delete(
          `https://qbfy.herokuapp.com/script_tags/${bannerScript.installedScript.id}`
        );
        if (result.data.error) {
          dispatch(uninstallFail(result.data.error));
        } else {
          dispatch(uninstallSuccess());
        }
      } catch (error) {
        dispatch(uninstallFail(error.message));
      }
    }
  };
  const titleDescription = bannerScript.isInstall ? "Uninstall" : "Install";
  const bodyDescription = bannerScript.isInstall ? "Installed" : "Uninstalled";

  return (
    <Page>
      <Layout.AnnotatedSection
        title={`${titleDescription} Banner`}
        description="Toggle banner installation on your shop"
      >
        <SettingToggle
          action={{
            content: titleDescription,
            onAction: handleInstall,
            loading: bannerScript.isLoading,
            disabled: bannerScript.isLoading,
            destructive: !!bannerScript.installedScript,
          }}
        >
          {bannerScript.isError ? (
            <p>Something is wrong! Please try again</p>
          ) : (
            <p>
              The banner script is{" "}
              <TextStyle variation="strong">{bodyDescription}</TextStyle>
            </p>
          )}
        </SettingToggle>
      </Layout.AnnotatedSection>
    </Page>
  );
}

export default install;
