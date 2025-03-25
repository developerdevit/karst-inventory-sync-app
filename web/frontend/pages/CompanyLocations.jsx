import { useState } from "react";
import {
  Card,
  Page,
  Layout,
  BlockStack,
  Text,
  List,
  Badge,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import Loader from "../components/Loader";
import { useAuthenticatedFetch } from "../hooks";

export default function CompanyLocationsPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const [warning, setWarning] = useState(null);

  const fetch = useAuthenticatedFetch();

  const fetchCompanyLocations = () => {
    try {
      setLoading(true);
      setData(null);

      fetch("/api/company_locations", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.success && res?.data?.data) {
            console.log("res?.data", res?.data?.data);

            setData(res?.data?.data);
            res?.data?.meta?.warning && setWarning(res?.data?.meta?.warning);
          }
        })
        .finally(() => setLoading(false));
    } catch (error) {
      console.log("fetchInfo error: ", error);
    }
  };

  const deleteCompanyLocations = () => {
    try {
      setDeleteLoading(true);
      setDeleteData(null);

      fetch("/api/company_locations", {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.success && res?.data) {
            console.log("res?.data", res?.data);

            setDeleteData(res?.data);
          }
        })
        .finally(() => setDeleteLoading(false));
    } catch (error) {
      console.log("fetchInfo error: ", error);
    }
  };

  return (
    <Page narrowWidth>
      <TitleBar
        title={"Company Locations"}
        primaryAction={{
          content: "Refresh",
          destructive: false,
          onAction: fetchCompanyLocations,
          loading: loading,
        }}
        secondaryActions={[
          {
            content: "Delete",
            destructive: true,
            onAction: deleteCompanyLocations,
            loading: deleteLoading,
          },
        ]}
      />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack>
              <Text as="h2" variant="headingLg">
                Company Locations with Catalogs
              </Text>

              <Loader loading={loading} />
              {data && (
                <div style={{ marginTop: "1rem" }}>
                  <List type="bullet">
                    {data
                      // ?.filter((catalog) =>
                      //   checked
                      //     ? catalog?.__typename
                      //         ?.toLowerCase()
                      //         ?.includes("companylocationcatalog")
                      //     : true
                      // )
                      ?.map((companyLocation, idx) => {
                        const catalog = companyLocation?.catalogs?.nodes?.[0];

                        return (
                          <List.Item key={companyLocation?.id + idx}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: "0.25rem",
                                marginBottom: "0.625rem",
                              }}
                            >
                              <Text as="h3" variant="headingMd">
                                {companyLocation?.name}
                              </Text>
                              {companyLocation?.id && (
                                <Text variant="bodySm">
                                  {companyLocation?.id}
                                </Text>
                              )}
                              {catalog ? (
                                <div style={{ paddingLeft: "1rem" }}>
                                  <Text as="h4" variant="headingSm">
                                    {catalog?.title}
                                    <div
                                      style={{
                                        marginLeft: "0.5rem",
                                        display: "inline-block",
                                      }}
                                    >
                                      <Badge
                                        size="small"
                                        tone={
                                          catalog?.status === "ACTIVE"
                                            ? "success"
                                            : ""
                                        }
                                      >
                                        {catalog?.status}
                                      </Badge>{" "}
                                    </div>
                                  </Text>

                                  <Text>
                                    Currency:{" "}
                                    {
                                      <>
                                        {catalog?.priceList?.currency ? (
                                          <span style={{ fontWeight: "600" }}>
                                            {catalog?.priceList?.currency}
                                          </span>
                                        ) : (
                                          <code>null</code>
                                        )}
                                      </>
                                    }
                                  </Text>
                                </div>
                              ) : (
                                <div style={{ paddingLeft: "1rem" }}>
                                  <Text variant="bodyMd">No catalog</Text>
                                </div>
                              )}

                              {/* <Text variant="bodySm">{catalog?.id}</Text> */}

                              {/* <Text variant="bodyMd">{catalog?.__typename}</Text> */}
                            </div>
                          </List.Item>
                        );
                      })}
                  </List>
                  {/* <code>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                  </code> */}
                </div>
              )}
              {!data && !loading && (
                <p style={{ marginTop: "0.5rem" }}>No data fetched...</p>
              )}
            </BlockStack>
          </Card>
          {deleteData && (
            <div style={{ marginTop: "1rem" }}>
              <Card>
                <BlockStack>
                  <Text as="h2" variant="headingLg">
                    Delete response
                  </Text>
                  <code>
                    <pre>{JSON.stringify(deleteData, null, 2)}</pre>
                  </code>

                  <Loader loading={deleteLoading} />
                </BlockStack>
              </Card>
            </div>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
