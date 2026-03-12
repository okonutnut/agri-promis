import {
  Document,
  Page,
  Text,
  View,
  Font,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { MonitoringReportType } from "@/components/types";

// Register Font
Font.register({
  family: "Cambria",
  src: "/fonts/Cambria.woff",
});
Font.register({
  family: "Cambria",
  src: "/fonts/Cambriab.woff",
  fontWeight: "bold",
});

const DEFAULT_DOCUMENT_CODE = "DARFO2.FOD.271";
const DEFAULT_EFFECTIVITY_DATE = "7/1/2025";
const DEFAULT_REV_NO = "0";

const HeaderSection = () => (
  <View
    style={{
      height: "57",
      display: "flex",
      flexDirection: "row",
      borderWidth: "1",
    }}
  >
    <View
      style={{
        width: 130,
        borderRightWidth: "1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image src="/printing/image1.png" style={{ width: 70, height: 70 }} />
    </View>
    <View
      style={{
        width: 300,
        borderRightWidth: "1",
        textAlign: "center",
        padding: "0.14in",
      }}
    >
      <Text style={{ fontWeight: "bold", marginTop: "2" }}>
        DEPARTMENT OF AGRICULTURE
      </Text>
      <Text style={{ fontWeight: "bold", marginTop: "3" }}>
        REGIONAL FIELD OFFICE NO. 02
      </Text>
    </View>
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Text
          style={{
            width: "55%",
            padding: 4,
            borderRightWidth: 0.7,
            borderBottomWidth: 0.7,
          }}
        >
          Document Code:
        </Text>
        <Text style={{ flex: 1, padding: 4, borderBottomWidth: 0.7 }}>
          {DEFAULT_DOCUMENT_CODE}
        </Text>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Text
          style={{
            width: "55%",
            padding: 4,
            borderRightWidth: 0.7,
            borderBottomWidth: 0.7,
          }}
        >
          Effectivity Date:
        </Text>
        <Text style={{ flex: 1, padding: 4, borderBottomWidth: 0.7 }}>
          {DEFAULT_EFFECTIVITY_DATE}
        </Text>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Text style={{ width: "55%", padding: 4, borderRightWidth: 0.7 }}>
          Rev. No.:
        </Text>
        <Text style={{ flex: 1, padding: 4 }}>{DEFAULT_REV_NO}</Text>
      </View>
    </View>
  </View>
);

// Labeled row helper
const LabeledRow = ({
  label,
  value,
  borderBottom = true,
}: {
  label: string;
  value: string;
  borderBottom?: boolean;
}) => (
  <View
    style={{
      flexDirection: "row",
      borderBottomWidth: borderBottom ? 0.7 : 0,
      minHeight: 20,
    }}
  >
    <Text style={{ width: 140, padding: 4, fontWeight: "bold" }}>{label}</Text>
    <Text style={{ flex: 1, padding: 4 }}>{value}</Text>
  </View>
);

// Multi-value row (for arrays like findings, issues/concerns)
const MultiValueRow = ({
  label,
  values,
  borderBottom = true,
}: {
  label: string;
  values: string[];
  borderBottom?: boolean;
}) => (
  <View
    style={{
      flexDirection: "row",
      borderBottomWidth: borderBottom ? 0.7 : 0,
      minHeight: 20,
    }}
  >
    <Text style={{ width: 140, padding: 4, fontWeight: "bold" }}>{label}</Text>
    <View style={{ flex: 1, padding: 4 }}>
      {values.length > 0 ? (
        values.map((item, i) => (
          <Text key={i} style={{ marginBottom: 2 }}>
            {i + 1}. {item}
          </Text>
        ))
      ) : (
        <Text>N/A</Text>
      )}
    </View>
  </View>
);

type MonitoringReportReactPDFProps = {
  data: MonitoringReportType;
};

export default function MonitoringReportReactPDF({
  data,
}: MonitoringReportReactPDFProps) {
  const inclusiveDates = () => {
    const travelOrder = data.travel_order;
    if (!travelOrder?.departure_date) return "N/A";
    const start = format(
      new Date(travelOrder.departure_date),
      "MMM d, yyyy",
    );
    if (!travelOrder.return_date) return start;
    const end = format(new Date(travelOrder.return_date), "MMM d, yyyy");
    return `${start} - ${end}`;
  };

  const reporterName = data.reporter?.fullname || "N/A";
  const reporterPosition = data.reporter?.position || "";
  const travelOrderNo =
    data.travel_order?.travel_order_no || data.travel_order_no || "N/A";
  const projectLocation = data.project_location?.location || "N/A";
  const createdAt = data.created_at
    ? format(new Date(data.created_at), "MMM d, yyyy")
    : "N/A";

  return (
    <Document>
      {/* Main Page */}
      <Page
        size="FOLIO"
        orientation="portrait"
        style={{
          fontSize: 8,
          paddingVertical: "0.75in",
          paddingHorizontal: "0.7in",
          fontFamily: "Cambria",
        }}
      >
        <HeaderSection />

        <Text
          style={{
            textAlign: "center",
            marginTop: 20,
            marginBottom: 10,
            fontSize: 11,
            fontWeight: "bold",
          }}
        >
          MONITORING REPORT
        </Text>

        {/* Report details table */}
        <View style={{ borderWidth: 1 }}>
          <LabeledRow label="Date:" value={createdAt} />
          <LabeledRow label="Travel Order No:" value={travelOrderNo} />
          <LabeledRow
            label="Inclusive Date of Travel:"
            value={inclusiveDates()}
          />
          <LabeledRow label="Reporter:" value={reporterName} />
          <LabeledRow label="Location:" value={projectLocation} />
          <LabeledRow label="Purpose:" value={data.purpose || "N/A"} />
          <MultiValueRow
            label="Findings:"
            values={data.findings || []}
          />
          <LabeledRow
            label="Observation:"
            value={data.observation || "N/A"}
          />
          <MultiValueRow
            label="Issues / Concerns:"
            values={data.issues_concern || []}
          />
          <LabeledRow
            label="Remarks:"
            value={data.remarks || "N/A"}
            borderBottom={false}
          />
        </View>

        {/* Signatures */}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            marginTop: 30,
          }}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text>Prepared by:</Text>
            <Text
              style={{
                textDecoration: "underline",
                fontWeight: "bold",
                marginTop: 25,
                marginBottom: 3,
              }}
            >
              {reporterName.toUpperCase()}
            </Text>
            <Text>{reporterPosition}</Text>
          </View>
          {data.reviewedBy && (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>Reviewed by:</Text>
              <Text
                style={{
                  textDecoration: "underline",
                  fontWeight: "bold",
                  marginTop: 25,
                  marginBottom: 3,
                }}
              >
                {data.reviewedBy.fullname?.toUpperCase() || ""}
              </Text>
              <Text>{data.reviewedBy.position || ""}</Text>
            </View>
          )}
        </View>
      </Page>

      {/* Photo Page */}
      {data.photo_url && data.photo_url.length > 0 && (
        <Page
          size="FOLIO"
          orientation="portrait"
          style={{
            fontSize: 8,
            paddingVertical: "0.75in",
            paddingHorizontal: "0.7in",
            fontFamily: "Cambria",
          }}
        >
          <HeaderSection />
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              marginBottom: 10,
              fontSize: 11,
              fontWeight: "bold",
            }}
          >
            MONITORING REPORT - PHOTO DOCUMENTATION
          </Text>

          <View
            style={{
              borderWidth: 1,
              flexDirection: "row",
              flexWrap: "wrap",
              minHeight: 200,
            }}
          >
            {data.photo_url.map((url, index) => (
              <View
                key={index}
                style={{
                  width: "50%",
                  height: 200,
                  padding: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRightWidth: index % 2 === 0 ? 0.7 : 0,
                  borderBottomWidth: 0.7,
                }}
              >
                <Image
                  src={url}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </View>
            ))}
          </View>

          {/* Info row below photos */}
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderTopWidth: 0,
            }}
          >
            <Text style={{ flex: 1, borderRightWidth: 1, padding: 3 }}>
              Location: {projectLocation.toUpperCase()}
            </Text>
            <Text style={{ flex: 1, padding: 3 }}>
              Prepared by: {reporterName.toUpperCase()}
            </Text>
          </View>
        </Page>
      )}
    </Document>
  );
}
