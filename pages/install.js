import React from "react";
import { Page, SettingToggle, TextStyle, Layout } from "@shopify/polaris";
import gql from "graphql-tag";
import { useQuery,useMutation } from "react-apollo";

const GET_SCRIPT_TAG = gql`
  query getScriptTag($src: URL){
    scriptTags(first : 10, src : $src){
      edges {
        node {
          src,
          id
        }
      }
    }
  }
`;

const CREATE_SCRIPT_TAG = gql`
  mutation createScriptTag($input: ScriptTagInput!){
    scriptTagCreate(input : $input){
      scriptTag {
        src,
        id
      }
      userErrors{
        message
      }
    }
  }
`;

const DELETE_SCRIPT_TAG = gql`
  mutation deleteScriptTag($id: ID!){
    scriptTagDelete(id : $id){
      deletedScriptTagId
      userErrors{
        message
      }
    }
  }
`

const initialState = {
  isInstall: false,
  isLoading: false,
  isError: "",
  script: "https://facebook.com/",
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
  const [bannerScript, dispatch] = React.useReducer(reducer, initialState);
  // Handle get script tag logic
  const {loading, error } = useQuery(GET_SCRIPT_TAG, {
    variables: { src: bannerScript.script },
    onCompleted : data => {
      console.log("Get script tag", data);
      let getScriptTagData = data.scriptTags.edges;
      if(getScriptTagData.length){
        dispatch(installSuccess(getScriptTagData[0].node));
      }
    }
  });
  
  // Handle Create script tag logic
  const [handleInstall, { loading : createLoading }] = useMutation(CREATE_SCRIPT_TAG,{
    variables : {input : {src : bannerScript.script}},
    onCompleted : data => {
      console.log("Create script tag",data);
      let createScriptTagdata = data?.scriptTagCreate.scriptTag;
      let createScriptTagError = data?.scriptTagCreate.userErrors ;
      if(createScriptTagdata){
        dispatch(installSuccess(createScriptTagdata));
      }else if(createScriptTagError.length){
        dispatch(installFail("Something is Wrong! Please try again."));
      }
    }
  })

  // Handle Delete script tag logic
  const [handleUninstall, { loading : deleteLoading }] = useMutation(DELETE_SCRIPT_TAG,{
    variables : {id : bannerScript.installedScript?.id},
    onCompleted : data => {
      console.log("Delete script tag",data);
      let deleteScriptTagData = data?.scriptTagDelete.deletedScriptTagId;
      let deleteScriptTagError = data?.scriptTagDelete.userErrors ;
      if(deleteScriptTagData != null){
        dispatch(uninstallSuccess());
      }else if(deleteScriptTagError.length){
        dispatch(uninstallFail(deleteScriptTagError.message));
      }
    }
  })

  const scriptTagToggle = bannerScript.isInstall ? handleUninstall : handleInstall;
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
            onAction: scriptTagToggle,
            loading: loading || createLoading || deleteLoading,
            disabled: loading || createLoading || deleteLoading,
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
